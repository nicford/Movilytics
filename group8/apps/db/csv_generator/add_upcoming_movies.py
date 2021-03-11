import requests 
import pandas as pd
import numpy as np
from credential import API_KEY

target_dir = '../csv_data/'

movies = pd.read_csv(f'{target_dir}movies.csv')
df_genres = pd.read_csv(f'{target_dir}genres.csv')
df_genre_info = pd.read_csv(f'{target_dir}genre_info.csv')
df_companies = pd.read_csv(f'{target_dir}companies.csv')
df_company_info = pd.read_csv(f'{target_dir}company_info.csv')
df_countries = pd.read_csv(f'{target_dir}countries.csv')
df_country_info = pd.read_csv(f'{target_dir}country_info.csv')
df_spoken_languages = pd.read_csv(f'{target_dir}spoken_languages.csv')
df_language_info = pd.read_csv(f'{target_dir}language_info.csv')
df_people = pd.read_csv(f'{target_dir}people.csv')
df_person = pd.read_csv(f'{target_dir}person.csv')

seen_genre_id = df_genre_info['genre_id'].values
seen_company_id = df_company_info['company_id'].values
seen_country_id = df_country_info['country_id'].values
seen_language_id = df_language_info['language_id'].values

def request_upcoming(pageNum):
    endpoint = f"https://api.themoviedb.org/3/movie/upcoming?api_key={API_KEY}&language=en-US&page={pageNum}"
    # sending get request and saving the response as response object 
    r = requests.get(url=endpoint) 
    # extracting data in json format 
    data = r.json()
    return data

def request_movie(mid):
    endpoint = f"https://api.themoviedb.org/3/movie/{mid}?api_key={API_KEY}&language=en-US"
    # sending get request and saving the response as response object
    r = requests.get(url=endpoint)
    # extracting data in json format
    data = r.json()
    return data

df_upcoming = pd.DataFrame(columns=[
    'mid', 'adult', 'budget', 'language_id', 'overview', 'popularity',
    'poster_path', 'runtime', 'status', 'tagline', 'title', 'video',
    'vote_average', 'vote_count', 'year', 'revenue'
])

i = 0  # only track index of df_upcoming
for page in range(1, 6):  # 20 upcoming movies per page, so getting 100
    upcomings = request_upcoming(page)['results']
    for upcoming in upcomings:
        try:
            mid = upcoming['id']
        except:
            continue
        
        # From movie API
        movie = request_movie(mid)
        try:
            adult = movie['adult']
            budget = movie['budget']
            language_id = movie['original_language']
            overview = movie['overview']
            popularity = movie['popularity']
            poster_path = movie['poster_path']
            runtime = movie['runtime']
            # status should be 'Upcoming'
            tagline = movie['tagline']
            title = movie['title']
            video = movie['video']
            vote_average = movie['vote_average']
            vote_count = movie['vote_count']
            _ymd = movie['release_date']
            year = _ymd.split('-')[0]
            revenue = movie['revenue']
            
        except:
            continue
        
        # Fill in dataframes
        df_upcoming.at[i, 'mid'] = mid
        df_upcoming.at[i, 'adult'] = adult
        df_upcoming.at[i, 'budget'] = budget
        df_upcoming.at[i, 'language_id'] = language_id
        df_upcoming.at[i, 'overview'] = overview
        df_upcoming.at[i, 'popularity'] = popularity
        df_upcoming.at[i, 'poster_path'] = poster_path
        df_upcoming.at[i, 'runtime'] = runtime
        df_upcoming.at[i, 'status'] = 'Upcoming'
        df_upcoming.at[i, 'tagline'] = tagline
        df_upcoming.at[i, 'title'] = title
        df_upcoming.at[i, 'video'] = video
        df_upcoming.at[i, 'vote_average'] = vote_average
        df_upcoming.at[i, 'vote_count'] = vote_count
        df_upcoming.at[i, 'year'] = year
        df_upcoming.at[i, 'revenue'] = revenue
        i += 1
        
        # Possible updates in other tables
        # 1. Genres
        genres_list = movie['genres']
        for genre_dict in genres_list:
            genre_row = pd.Series({
                'mid': mid,
                'genre_id': genre_dict['id']
            })
            df_genres = df_genres.append(genre_row, ignore_index=True)
            
            # Check unseen
            if genre_dict['id'] not in seen_genre_id:
                # update genre_info
                df_genre_info = df_genre_info.append(pd.Series({
                    'genre_id': genre_dict['id'],
                    'genre_name': genre_dict['name']
                }), ignore_index=True)
        
        # 2. Companies
        companies_list = movie['production_companies']
        for company_dict in companies_list:
            company_row = pd.Series({
                'mid': mid,
                'company_id': company_dict['id']
            })
            df_companies = df_companies.append(company_row, ignore_index=True)
            
            # Check unseen
            if company_dict['id'] not in seen_company_id:
                # update company_info
                df_company_info = df_company_info.append(pd.Series({
                    'company_id': company_dict['id'],
                    'company_name': company_dict['name'],
                    'country_id': company_dict['origin_country']
                }), ignore_index=True)
        
        
        # 3. Countries
        countries_list = movie['production_countries']
        for country_dict in countries_list:
            country_row = pd.Series({
                'mid': mid,
                'country_id': country_dict['iso_3166_1']
            })
            df_countries = df_countries.append(country_row, ignore_index=True)
            
            # Check unseen
            if country_dict['iso_3166_1'] not in seen_country_id:
                # update genre_info
                df_country_info = df_country_info.append(pd.Series({
                    'country_id': country_dict['iso_3166_1'],
                    'country_name': country_dict['name']
                }), ignore_index=True)
        
        
        # 4. Spoken_languages
        spoken_languages_list = movie['spoken_languages']
        for spoken_language_dict in spoken_languages_list:
            spoken_language_row = pd.Series({
                'mid': mid,
                'language_id': spoken_language_dict['iso_639_1']
            })
            df_spoken_languages = df_spoken_languages.append(spoken_language_row, ignore_index=True)
            
            # Check unseen
            if spoken_language_dict['iso_639_1'] not in seen_language_id:
                # update genre_info
                df_language_info = df_language_info.append(pd.Series({
                    'language_id': spoken_language_dict['iso_639_1'],
                    'language_name': spoken_language_dict['english_name']
                }), ignore_index=True)
        
        
        # 5. People --> Can't load casts of upcoming movies from tmdb API
        if i%20==0:
            print("Iteration: ", i)


###########
# Cleaning empty values, consistent data types
##########
"""
Rule: 
- if a field is numerical, -1 represents N.A.
- if a field is non-numerical, ""(empty string) reprsents N.A
"""
# Fill na with -1
df_genres['genre_id'] = df_genres['genre_id'].fillna(-1)
df_genres = df_genres.astype({'genre_id': 'int32'})

df_companies['company_id'] = df_companies['company_id'].fillna(-1)
df_companies = df_companies.astype({'mid':'int32', 'company_id': 'int32'})
df_company_info['country_id'] = df_company_info['country_id'].fillna("")

df_countries['country_id'] = df_countries['country_id'].fillna("")

df_spoken_languages['language_id'] = df_spoken_languages['language_id'].fillna("")

# Concatenate upcomings to movies
df_movies = pd.concat([movies, df_upcoming])

## Checking na columns in movies
# for col in df_movies.columns:
#     if not sum(df_movies[col].isna()) ==0:
#         print(col)

df_movies['overview'] = df_movies['overview'].fillna("")
df_movies['overview'] = df_movies['overview'].replace("None", "")

df_movies['poster_path'] = df_movies['poster_path'].fillna("")
df_movies['poster_path'] = df_movies['poster_path'].replace("None", "")

df_movies['tagline'] = df_movies['tagline'].fillna("")
df_movies['tagline'] = df_movies['tagline'].replace("None", "")


# TO CSV
df_movies.to_csv(f'{target_dir}movies.csv', index=False)
df_genres.to_csv(f'{target_dir}genres.csv', index=False)
df_genre_info.to_csv(f'{target_dir}genre_info.csv', index=False)
df_companies.to_csv(f'{target_dir}companies.csv', index=False)
df_company_info.to_csv(f'{target_dir}company_info.csv', index=False)
df_countries.to_csv(f'{target_dir}countries.csv', index=False)
df_country_info.to_csv(f'{target_dir}country_info.csv', index=False)
df_spoken_languages.to_csv(f'{target_dir}spoken_languages.csv', index=False)
df_language_info.to_csv(f'{target_dir}language_info.csv', index=False)
