import psycopg2
import time
from secrets import functions_test_cases, tables_test_cases, host, database, user, password

"""
BEFORE YOU RUN THIS SCRIPT, MAKE SUER YOU DON'T CACHE YOUR QUERIED RESULT
"""

report_export_path = './before_optimisation.txt'

""" Connect to the PostgreSQL database server """
try:

    # connect to the PostgreSQL server
    print('Connecting to the PostgreSQL database...')
    conn = psycopg2.connect(
            host=host,
            database=database,
            user=user,
            password=password)
    
    # create a cursor
    cursor = conn.cursor()
    
    with open(report_export_path, 'w') as f:
        
        for i, test_case in enumerate(functions_test_cases):

            f.write(f"================\nTEST CASE {i} \nQuery: {test_case} \n")

            test_case_result = []
            for x in range(10):
                # Execute EXPLAIN ANALYSE query
                cursor.execute(test_case)
                # Get Execution time
                record = float(list(cursor)[-1][0][16:-3])
                test_case_result.append(record)
                f.write(f'iter {x}: {record} ms \n')
                time.sleep(2)


            avg = sum(test_case_result)/10
            f.write(f'Average Execution time: {avg} ms \n')
            f.write("================\n\n")

    
    # close the communication with the PostgreSQL
    cursor.close()
except (Exception, psycopg2.DatabaseError) as error:
    print(error)
finally:
    if conn is not None:
        conn.close()
        print('Database connection closed.')
