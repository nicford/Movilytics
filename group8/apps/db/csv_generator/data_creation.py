import requests 
import pandas as pd
import numpy as np
from credential import API_KEY
import os
import sys
import glob

# csv file output storage
if not os.path.isdir('../csv_data'):
    os.mkdir('../csv_data')

##########
# Load given dataset
##########
# Table: links
df_links = pd.read_csv('../csv_data/links.csv')
df_links.columns = ['mid', 'imdbid', 'tmdbid']

# Table: ratings
df_ratings = pd.read_csv('../csv_data/ratings.csv')
df_ratings.columns = ['user_id', 'mid', 'rating', 'timestamp']

# API's API
def request_movie(mid):
    endpoint = f"https://api.themoviedb.org/3/movie/{mid}?api_key={API_KEY}&language=en-US"
    # sending get request and saving the response as response object 
    r = requests.get(url=endpoint) 
    # extracting data in json format 
    data = r.json()
    return data

def request_credits(mid):
    endpoint = f"https://api.themoviedb.org/3/movie/{mid}/credits?api_key={API_KEY}&language=en-US"
    # sending get request and saving the response as response object 
    r = requests.get(url=endpoint) 
    # extracting data in json format 
    data = r.json() 
    return data

def request_person(person_id):
    endpoint = f"https://api.themoviedb.org/3/person/{person_id}?api_key={API_KEY}&language=en-US"
    # sending get request and saving the response as response object 
    r = requests.get(url=endpoint) 
    # extracting data in json format 
    data = r.json() 
    return data


#########
# Initialising tables (dataframes)
#########
movies_cols = [
    'movie_id',
    'adult',
    'budget',
    'genre_id',
    'language_id', # In API: original_language
    'overview',
    'popularity',
    'poster_path',
    'company_id', # In API: production_companies -> id
    'country_id', # In API: production_countries -> iso_3166_1
    'runtime',
    'spoken_languages', # In API: spoken_languages -> iso_639_1
    'status',
    'tagline',
    'title',
    'video',
    'vote_average',
    'vote_count',
    'person_id'
]

df_movies = pd.DataFrame(columns=movies_cols)
df_genre = pd.DataFrame(columns=['genre_id', 'genre_name'])
df_spoken_languages = pd.DataFrame(columns=['language_id', 'language_name'])
df_production_companies = pd.DataFrame(columns=['company_id', 'company_name', 'country_id'])
df_countries = pd.DataFrame(columns=['country_id', 'country_name'])
df_users = pd.DataFrame(columns=['user_id', 'f_name', 'l_name', 'email'])
df_people = pd.DataFrame(columns=[
    'person_id', 'name',
    'department', # API: known_for_department
    'birthday', 'deathday', 'gender',
    'birth_place'
])

print("DataFrames initialised")


################
# Final stage where you pull data from API and fill DFs
################
print("Filling dataframes in...")
for i, mid in enumerate(df_links[['tmdbid']].values):
    try:
        mid = int(mid)
    except:
        print("tmdbid is NaN")
        continue
    
    try:
        # Get results from API
        movie = request_movie(mid)
        
        credits = request_credits(mid)

        # 1. person_id (max 5)
        person_id_for_movie = ""  # movie table field
        casts = credits['cast']
        
        for cast in casts[:5]:  # only getting max 5 casts
            person_id = cast['id']
            if person_id not in df_people['person_id'].values:
                ## Fill people table
                # Get result from person API
                person = request_person(person_id)
                person_series = pd.Series({
                    'person_id': person['id'], 
                    'name': person['name'],
                    'department': person['known_for_department'],
                    'birthday': person['birthday'],
                    'gender': person['gender'],
                    'birth_place': person['place_of_birth']
                })

                df_people = df_people.append(person_series, ignore_index=True)
            
            person_id_for_movie += str(person_id)+"|"
        person_id_for_movie = person_id_for_movie[:-1] # remove last '|'
        

        # Get single values
        movie_id = movie['id']
        title = movie['title']
        overview = movie['overview']
        budget = movie['budget']
        adult = movie['adult']
        language_id = movie['original_language']
        popularity = movie['popularity']
        poster_path = movie['poster_path']
        video = movie['video']
        vote_average = movie['vote_average']
        vote_count = movie['vote_count']
        status = movie['status']
        tagline = movie['tagline']
        runtime = movie['runtime']
        
        # Get multiple values
        # 2. genres
        genre_list = movie['genres']
        
        genre_id_for_movie = "" # movie table field
        for genre_dict in genre_list:
            genre_id = genre_dict['id']
            if genre_id not in df_genre['genre_id'].values:
                ## Fill genre Table
                genre_series = pd.Series({
                    'genre_id': genre_id,
                    'genre_name': genre_dict['name']
                })
                
                df_genre = df_genre.append(genre_series, ignore_index=True)
                
            genre_id_for_movie += str(genre_id)+'|'
        genre_id_for_movie = genre_id_for_movie[:-1] # remove last '|'
        
        # 3. company_id (max 3)
        company_id_list = movie['production_companies']
        
        company_id_for_movie = "" # movie table field
        for company_dict in company_id_list[:3]:  # only getting max 3 companies
            company_id = company_dict['id']
            if company_id not in df_production_companies['company_id'].values:
                ## Fill production_companies Table
                company_series = pd.Series({
                    'company_id': company_id, 
                    'company_name': company_dict['name'],
                    'country_id': company_dict['origin_country']
                })
                
                df_production_companies = df_production_companies.append(company_series, ignore_index=True)
                
            company_id_for_movie += str(company_id)+'|'
        company_id_for_movie = company_id_for_movie[:-1] # remove last '|'
        
        
        # 4. country_id (max 3)
        countries_list = movie['production_countries']
        
        country_id_for_movie = "" # movie table field
        for country_dict in countries_list[:3]:  # getting max 3
            country_id = country_dict['iso_3166_1']
            if country_id not in df_countries['country_id'].values:
                ## Fill countries Table
                country_series = pd.Series({
                    'country_id': country_id,
                    'country_name': country_dict['name']
                })
                
                df_countries = df_countries.append(country_series, ignore_index=True)
                
            country_id_for_movie += str(country_id)+'|'
        country_id_for_movie = country_id_for_movie[:-1] # remove last '|'
        
        
        # 5. spoken_languages (max 3)
        spoken_languages_list = movie['spoken_languages']
        
        spoken_languages_for_movie = "" # movie table field
        for spoken_lang_dict in spoken_languages_list[:3]:  # max 3
            spoken_lang_id = spoken_lang_dict['iso_639_1']
            if spoken_lang_id not in df_spoken_languages['language_id'].values:
                ## Fill spoken_languages Table
                sl_series = pd.Series({
                    'language_id': spoken_lang_id,
                    'language_name': spoken_lang_dict['english_name']
                })
                
                df_spoken_languages = df_spoken_languages.append(sl_series, ignore_index=True)
                
            spoken_languages_for_movie += str(spoken_lang_id)+'|'
        spoken_languages_for_movie = spoken_languages_for_movie[:-1] # remove last '|'
        
        
        ## Fill movie Table
        movie_row_series = pd.Series({
            'movie_id': movie_id,
            'title': title,
            'genre_id': genre_id_for_movie,
            'overview': overview,
            'budget': budget,
            'adult': adult,
            'language_id': language_id,
            'popularity': popularity, 
            'poster_path': poster_path,
            'company_id': company_id_for_movie,
            'country_id': country_id_for_movie,
            'spoken_languages': spoken_languages_for_movie,
            'video': video,
            'vote_average': vote_average,
            'vote_count': vote_count,
            'status': status,
            'tagline': tagline,
            'person_id': person_id_for_movie, 
            'runtime': runtime
        })
        
        df_movies = df_movies.append(movie_row_series, ignore_index=True)

        if i%50==0:
            print(f"iteration: {i}, progress: {(i/9734) *100}%")
    except Exception as err:
        print("error msg: ", err, "continue...")
        # print("Hit Error, so just saving interim result to csv...")
        # print(f"by {i}th row")
        # df_movies.to_csv(f'./db/movies_tmdbid{i}.csv', index=False)
        # df_people.to_csv(f'./db/people_tmdbid{i}.csv', index=False)
        # df_countries.to_csv(f'./db/countries_tmdbid{i}.csv', index=False)
        # df_genre.to_csv(f'./db/genre_tmdbid{i}.csv', index=False)
        # df_production_companies.to_csv(f'./db/production_companies_tmdbid{i}.csv', index=False)
        # df_spoken_languages.to_csv(f'./db/spoken_languages_tmdbid{i}.csv', index=False)
        continue

#############
# Save to csv
#############
print("Saving to csv...")
df_links.to_csv('../csv_data/links.csv', index=False)
df_ratings.to_csv('../csv_data/rating.csv', index=False)
df_movies.to_csv('../csv_data/movies.csv', index=False)
df_people.to_csv('../csv_data/people.csv', index=False)
df_countries.to_csv('../csv_data/countries.csv', index=False)
df_genre.to_csv('../csv_data/genre.csv', index=False)
df_production_companies.to_csv('../csv_data/production_companies.csv', index=False)
df_spoken_languages.to_csv('../csv_data/spoken_languages.csv', index=False)

print("Finished")

########
# Create init_csv.sql
########
# Format:
"""
COPY links(mid,imdbid,tmdbid)
FROM './var/lib/postgresql/data/db_files/persons.csv'
DELIMITER ','
CSV HEADER;
"""

files = glob.glob("../csv_data/*.csv")
string = ""
for file in files:
    df = pd.read_csv(file)
    cols = list(df.columns)
    name = file.split('/')[-1].split('.')[0]
    
    string += f"COPY {name}("
    for col in cols:
        string += f"{col},"
    string = string[:-1]
    string += ")\n"  # First line finished
    
    string += f"FROM \'./var/lib/postgresql/data/db_files/{name}.csv\' \n"  # second line finished
    
    string += "DELIMITER \',\' \n"  # third line
    string += "CSV HEADER;"         # last line
    
    string += "\n \n \n"

# Write
with open('../init_csv.sql', "w") as f:
    f.write(string)

