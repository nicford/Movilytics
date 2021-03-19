import pandas as pd

# Place personality-data.csv downloaded from Grouplens
personality = pd.read_csv('../csv_data/personality-data.csv')

combined_userid = pd.DataFrame()
userid_df = pd.DataFrame(personality['userid'])
for i in range(12):
    combined_userid = pd.concat([combined_userid, userid_df])

personality_movies = personality[['movie_1', 'predicted_rating_1', 'movie_2',
                                   'predicted_rating_2', 'movie_3', 'predicted_rating_3', 'movie_4',
                                   'predicted_rating_4', 'movie_5', 'predicted_rating_5', 'movie_6',
                                   'predicted_rating_6', 'movie_7', 'predicted_rating_7', 'movie_8',
                                   'predicted_rating_8', 'movie_9', 'predicted_rating_9', 'movie_10',
                                   'predicted_rating_10', 'movie_11', 'predicted_rating_11', 'movie_12',
                                   'predicted_rating_12']]

combined_movies = pd.DataFrame(columns=['movieId', 'pred_rate'])
for i in range(1, 13):
    df_i = personality_movies[[f'movie_{i}', f'predicted_rating_{i}']]
    df_i.columns = ['movieId', 'pred_rate']
    combined_movies = pd.concat([combined_movies, df_i])

result = pd.concat([combined_userid, combined_movies], axis=1)
result = result.sort_values(by=['userid'])

# place links.csv from 25M Grouplens dataset 
new_links = pd.read_csv('../csv_data/ml-25m_links.csv')

result = result.merge(new_links, on='movieId', how='left')
result = result.dropna().drop(['movieId', 'imdbId'], axis=1).astype({'tmdbId':'int32'})
result.to_csv('../csv_data/user_pred_rate.csv', index=False)



