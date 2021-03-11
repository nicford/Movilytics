import os
import glob
imoprt requests
import pandas as pd

"""
Notice:
This script assume that you have unnormalised csv files under ../csv_data/
after you run ./data_creation.py.
"""
##########
# Rename table names
##########
target_dir = '../csv_data/'
change_dict = {
    'production_companies': 'company_info',
    'countries': 'country_info',
    'genre': 'genre_info',
    'spoken_languages': 'language_info',
    'people': 'person'
}

for original_name, new_name in change_dict.items():
    source = target_dir + original_name
    dest = target_dir + new_name
    try:
        os.rename(source, dest)
    except Exception as e:
        print("File Exception: ", e)

##########
# Make --> Genres, Companies, Countries, Spoken_languages, People
##########
# new df init
df_genres = pd.DataFrame(columns=['mid', 'genre_id'])
df_companies = pd.DataFrame(columns=['mid', 'company_id'])
df_countries = pd.DataFrame(columns=['mid', 'country_id'])
df_spoken_languages = pd.DataFrame(columns=['mid', 'language_id'])
df_people = pd.DataFrame(columns=['mid', 'person_id'])

# read original movies csv
movies_orig = pd.read_csv(f'{target_dir}movies.csv')

# Do not apply this for spoken languags in movie
def oneNFise(df, target_col, target_df):
    df_interest = df[['mid', target_col]]
    for i, row in df_interest.iterrows():
        curr_mid = row.mid
        curr_target_col_val = str(row[target_col])
        
        isNumeric = True if curr_target_col_val.isnumeric() else False

        # append empty val
        if curr_target_col_val=='nan':
            target_df = target_df.append(pd.Series({'mid':curr_mid, target_col: ''}), ignore_index=True)
        
        # Expand
        elif '|' in curr_target_col_val:
            id_list = (df[target_col].iloc[i]).split('|')
            
            for id in id_list:
                val = int(id) if isNumeric else id
                
                append_series = pd.Series({
                    'mid': curr_mid,
                    target_col: val
                })
                target_df = target_df.append(append_series, ignore_index=True)
        
        # Only one id so append just that
        else:
            val = int(curr_target_col_val) if isNumeric else curr_target_col_val
            target_df = target_df.append(pd.Series({'mid':curr_mid, target_col: val}), ignore_index=True)
        
    return target_df


def insert_index(df):
    df.insert(loc=0, column='index', value=[i for i in range(len(df))])

# Genres
df_genres = oneNFise(movies_orig, 'genre_id', df_genres)
insert_index(df_genres)
df_genres.to_csv(f'{target_dir}genres.csv', index=False)

# Countries
df_countries = oneNFise(movies_orig, 'country_id', df_countries)
insert_index(df_countries)
df_countries.to_csv(f'{target_dir}countries.csv', index=False)

# Companies
df_companies = oneNFise(movies_orig, 'company_id', df_companies)
insert_index(df_companies)
df_companies.to_csv(f'{target_dir}companies.csv', index=False)

# People
df_people = oneNFise(movies_orig, 'person_id', df_people)
insert_index(df_people)
df_people.to_csv(f'{target_dir}people.csv', index=False)

# Spoken_languages
# code below does the same thing as oneNFise but just only for Spoken_languages
df_interest = movies_orig[['mid', 'spoken_languages']]
for i, row in df_interest.iterrows():
    curr_mid = row.mid
    curr_target_col_val = str(row['spoken_languages'])
    if curr_target_col_val=='nan':
        df_spoken_languages = df_spoken_languages.append(pd.Series({'mid':curr_mid, 'language_id': ''}), ignore_index=True)
    elif '|' in curr_target_col_val:
        id_list = (df_interest['spoken_languages'].iloc[i]).split('|')
        for id in id_list:
            append_series = pd.Series({'mid': curr_mid, 'language_id': id})
            df_spoken_languages = df_spoken_languages.append(append_series, ignore_index=True)
    else:
        df_spoken_languages = df_spoken_languages.append(pd.Series({'mid':curr_mid, 'language_id': curr_target_col_val}), ignore_index=True)

insert_index(df_spoken_languages)
df_spoken_languages.to_csv(f'{target_dir}spoken_languages.csv', index=False)

# Drop columns in movie original
df_movies = movies_orig.drop(columns=['genre_id', 'company_id', 'country_id', 'spoken_languages', 'person_id'])
df_movies.to_csv(f'{target_dir}movies.csv', index=False)


##########
# Add more data in normalised form
##########
# Table: Translation
def request_translations(mid):
    endpoint = f"https://api.themoviedb.org/3/movie/{mid}/translations?api_key={API_KEY}"
    # sending get request and saving the response as response object 
    r = requests.get(url=endpoint) 
    # extracting data in json format 
    data = r.json()
    return data

movies = pd.read_csv(f'{target_dir}movies.csv')
mids = movies['mid'].values
df_language_info = pd.read_csv(f'{target_dir}language_info.csv')
# init df
df_translations = pd.DataFrame(columns=['mid', 'language_id'])

seen_lang = df_language_info['language_id'].values

# Get Translations info from tmdb API, 
# while checking any updates in df_language_info
i = 0
for mid in mids:
    result = request_translations(mid)
    try:
        trans = result['translations']
    except: # api fail
        continue
        
    for tran in trans:
        language_id = tran['iso_639_1']
        
        # if not in df_language_info
        if language_id not in seen_lang:
            eng_name = tran['english_name']
            # update df_language_info
            df_language_info.append(pd.Series({'language_id':language_id, 'language_name':eng_name }), ignore_index=True)
        
        # update df_translations
        df_translations.at[i, 'mid'] = mid
        df_translations.at[i, 'language_id'] = language_id
        i += 1

df_translations.to_csv(f'{target_dir}translations.csv', index=False)
df_language_info.to_csv(f'{target_dir}language_info.csv', index=False)

########
# Create init_csv.sql
########
# Example Format:
"""
COPY links(mid,imdbid,tmdbid)
FROM '/var/lib/postgresql/data/db_files/persons.csv'
DELIMITER ','
CSV HEADER;
"""

files = glob.glob("../csv_data/*.csv")
print("Generating init_csv.sql ...")

string = ""
for file in files:
    df = pd.read_csv(file)
    cols = list(df.columns)
    name = file.split('/')[-1].split('.')[0]
    # Not loading links to DB table
    if name == 'links':
        continue

    string += f"COPY {name}("
    for col in cols:
        string += f"{col},"
    string = string[:-1]
    string += ")\n"  # First line finished

    # second line finished
    string += f"FROM \'/var/lib/postgresql/data/db_files/{name}.csv\' \n"

    string += "DELIMITER \',\' \n"  # third line
    string += "CSV HEADER;"         # last line

    string += "\n \n \n"

# Write
with open('../init_csv.sql', "w") as f:
    f.write(string)
    
print("init_csv.sql is written")
