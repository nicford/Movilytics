import psycopg2


functions_test_cases = [
    "explain analyze SELECT * FROM <YOUR FUNCTION QUERY>"
]

tables_test_cases = [
    "explain analyze SELECT * FROM <YOUR TABLE NAME>",
]

# DB info
host="<PLACEHOLDER>"
database="<PLACEHOLDER>"
user="<PLACEHOLDER>"
password="<PLACEHOLDER>"