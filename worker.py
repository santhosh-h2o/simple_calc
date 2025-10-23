import redis
import os
from rq import Worker, Queue, Connection

# Initialize Redis connection
redis_host = os.environ.get('REDIS_HOST', 'localhost')
redis_port = int(os.environ.get('REDIS_PORT', 6379))
conn = redis.Redis(host=redis_host, port=redis_port)

def calculate_expression(expression):
    """
    Safely evaluate a mathematical expression and return the result
    """
    try:
        # Use eval with limited globals and locals for security
        result = str(eval(expression, {"__builtins__": None}, {}))
        return result
    except Exception as e:
        return f"Error: {str(e)}"

if __name__ == '__main__':
    # Start worker process
    with Connection(conn):
        worker = Worker(Queue('default'))
        worker.work()
