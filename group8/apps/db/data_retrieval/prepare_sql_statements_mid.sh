# sed -i 's/862/$1/g' 
# sed -i 's/862/$1/g' > ./prepared_queries
mkdir prepared_queries

for FILE in *.sql; do sed 's/862/$1/g' $FILE > ./prepared_queries/$FILE ; done