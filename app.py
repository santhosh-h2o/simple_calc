from flask import Flask, render_template, request, jsonify
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import redis
import hashlib
import os
from rq import Queue
from worker import conn, calculate_expression
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('calculator.log')
    ]
)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)

# Initialize Redis
redis_host = os.environ.get('REDIS_HOST', 'localhost')
redis_port = int(os.environ.get('REDIS_PORT', 6379))
redis_client = redis.Redis(host=redis_host, port=redis_port, decode_responses=True)

# Initialize RQ queue
queue = Queue(connection=conn)

# Initialize rate limiter
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"],
    storage_uri=f"redis://{redis_host}:{redis_port}"
)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
@limiter.limit("5 per second")
def calculate():
    data = request.get_json()
    expression = data.get('expression', '')
    
    try:
        # Basic safety check - only allow numbers and basic operators
        if not all(c in '0123456789+-*/.() ' for c in expression):
            raise ValueError("Invalid characters in expression")
        
        # Generate a cache key based on the expression
        cache_key = f"calc:{hashlib.md5(expression.encode()).hexdigest()}"
        
        # Try to get result from cache
        cached_result = redis_client.get(cache_key)
        if cached_result:
            logger.info(f"Cache hit for expression: {expression}")
            return jsonify({"result": cached_result, "error": None, "cached": True})
        
        # Queue the calculation job
        job = queue.enqueue(calculate_expression, expression)
        
        # Wait for the result with a timeout
        result = job.result
        
        # If job is still processing, return a job ID for polling
        if result is None:
            return jsonify({"job_id": job.id, "status": "processing"}), 202
            
        # Cache the result for future requests (expire after 1 hour)
        redis_client.set(cache_key, result, ex=3600)
        
        return jsonify({"result": result, "error": None})
    except Exception as e:
        logger.error(f"Error calculating expression: {expression}. Error: {str(e)}")
        return jsonify({"result": None, "error": str(e)}), 400

@app.route('/job/<job_id>', methods=['GET'])
def check_job(job_id):
    job = queue.fetch_job(job_id)
    
    if job is None:
        return jsonify({"error": "Job not found"}), 404
        
    if job.is_finished:
        return jsonify({"result": job.result, "status": "completed"})
    else:
        return jsonify({"status": job.get_status()}), 202

@app.errorhandler(429)
def ratelimit_handler(e):
    return jsonify({"error": "Rate limit exceeded. Please try again later."}), 429

if __name__ == '__main__':
    app.run(debug=True)
