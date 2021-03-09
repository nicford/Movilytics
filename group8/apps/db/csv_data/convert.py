import csv

with open("movies.csv") as csv_file:
    csv_reaeder = csv.reader(csv_file, delimiter=",")

    with open("movie_test.csv", "w") as out_file:
        csv_writer = csv.writer(out_file)
        for row in csv_reaeder:
            r = []
            for i in range(len(row)):
                if i == 3:
                    genre_id = row[i]
                    genre_id_delim = "{" + genre_id.replace("|", ",") + "}"
                    r.append(genre_id_delim)
                elif i == 8:
                    company_id = row[i]
                    company_id_delim = "{" + company_id.replace("|", ",") + "}"
                    r.append(company_id_delim)
                elif i == 9:
                    country_id = row[i]
                    country_id_delim = "{" + country_id.replace("|", ",") + "}"
                    r.append(country_id_delim)
                elif i == 11:
                    spoken_lang = row[i]
                    spoken_lang_delim = "{" + \
                        spoken_lang.replace("|", ",") + "}"
                    r.append(spoken_lang_delim)
                elif i == 18:
                    person_id = row[i]
                    person_id_delim = "{" + person_id.replace("|", ",") + "}"
                    r.append(person_id_delim)
                else:
                    r.append(row[i])

            adult = r[1]
            budget = r[2]
            genre = r[3]
            language = r[4]
            overview = r[5]
            popularity = r[6]
            poster_path = r[7]
            company = r[8]
            country = r[9]
            runtime = r[10]
            spoken_lang = r[11]
            status = r[12]
            tagline = r[13]
            title = r[14]
            video = r[15]
            vote_avg = r[16]
            vote_count = r[17]

            r[1] = title
            r[2] = genre
            r[3] = overview
            r[4] = budget
            r[5] = adult
            r[6] = language
            r[7] = popularity
            r[8] = runtime
            r[9] = poster_path
            r[10] = company
            r[11] = country
            r[12] = spoken_lang
            r[13] = video
            r[14] = vote_avg
            r[15] = vote_count
            r[16] = status
            r[17] = tagline

            csv_writer.writerow(r)

# movie_id,title,genre_id,overview,budget,adult,language_id,popularity,runtime,poster_path,company_id,country_id,spoken_languages,video,vote_average,vote_count,status,tagline,person_id
