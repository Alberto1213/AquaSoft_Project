import math
import re

import sqlalchemy
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from sqlalchemy import create_engine, text, MetaData, select, and_
from sqlalchemy.orm import sessionmaker
from webdriver_manager.chrome import ChromeDriverManager
import time
from transformers import pipeline


def facilities_rating(facilities):
    classifier = pipeline("sentiment-analysis", model="nlptown/bert-base-multilingual-uncased-sentiment")
    scoruri = []
    for f in facilities:
        result = classifier(f)[0]
        print(f"{f}: {result['label']} (score: {result['score']:.2f})")
        scoruri.append(int(result['label'][0]))\

    medie = sum(scoruri) / len(scoruri)
    print(f"Scor general facilități: {medie:.2f}/5")

    return medie


def negative_feedback_rating(negative_feedback):
    classifier = pipeline("sentiment-analysis", model="nlptown/bert-base-multilingual-uncased-sentiment")
    scoruri = []
    for f in negative_feedback:
        result = classifier(f)[0]
        print(f"{f}: {result['label']} (score: {result['score']:.2f})")
        scoruri.append(int(result['label'][0]))\

    medie = sum(scoruri) / len(scoruri)
    print(f"Scor general feedback negative: {medie:.2f}/5")
    return medie


def positive_feedback_rating(positive_feedback):
    classifier = pipeline("sentiment-analysis", model="nlptown/bert-base-multilingual-uncased-sentiment")
    scoruri = []
    for f in positive_feedback:
        result = classifier(f)[0]
        print(f"{f}: {result['label']} (score: {result['score']:.2f})")
        scoruri.append(int(result['label'][0]))\

    medie = sum(scoruri) / len(scoruri)
    print(f"Scor general feedback positive: {medie:.2f}/5")
    return medie


def title_rating(title):
    classifier = pipeline("sentiment-analysis", model="nlptown/bert-base-multilingual-uncased-sentiment")
    scoruri = []
    for f in title:
        result = classifier(f)[0]
        print(f"{f}: {result['label']} (score: {result['score']:.2f})")
        scoruri.append(int(result['label'][0]))\

    medie = sum(scoruri) / len(scoruri)
    print(f"Scor general titluri: {medie:.2f}/5")
    return medie


def scrapping(hoteluri) -> None:
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--start-maximized")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument(
        "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/114.0.0.0 Safari/537.36")

    # Inițializare driver
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    wait = WebDriverWait(driver, 20)

    # Lista de hoteluri

    for hotel in hoteluri:
        try:
            print(f"\n🔍 Caut: {hotel}")
            cautare = f"https://www.booking.com/searchresults.html?ss={hotel.replace(' ', '+')}"
            driver.get(cautare)

            wait.until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "div[data-testid='property-card'] a"))
            )
            primul_link = driver.find_element(By.CSS_SELECTOR, "div[data-testid='property-card'] a")
            link_hotel = primul_link.get_attribute("href")
            print(f"➡️  Găsit: {link_hotel}")

            # Navighează la pagina cu recenzii
            driver.get(link_hotel + "#tab-reviews")
            time.sleep(2)

            final_rating = 0
            #extragem facilitatiile
            facilities = driver.find_elements(By.XPATH,
                                              '//*[@id="hp_facilities_box"]//ul/li/div/div/div/span/div/span')
            facilities_list = [
                (f.text.strip() if f.text.strip() else f.get_attribute('textContent').strip())
                for f in facilities
            ]

            insert_facilities_for_hotel(hotel_name=hotel, facilities_list=facilities_list)
            facilities_score = 2 * facilities_rating(facilities=facilities_list)
            final_rating += 0.2 * facilities_score


            #extragem ratingul general
            general_rating = driver.find_elements(By.CSS_SELECTOR, '[data-testid="reviews-tab-score-header"]')
            if general_rating:
                general_rating = general_rating[0].text

            if general_rating:
                rating = float(general_rating.split("\n")[1])
                final_rating += 0.4 * rating
                insert_rating_for_hotel(hotel_name=hotel, rating=rating)

            #extragem categoriile
            categories = driver.find_elements(By.CSS_SELECTOR, '[data-testid="review-subscore"]')
            insert_categories_for_hotel(hotel_name=hotel, categories_list=categories)
            categories_score = 0
            categories_len = 0
            for c in categories:
                parts = c.text.strip().replace('\n', ' ')
                if parts:
                    score = float(parts[-3:].replace(',', '.'))
                    categories_score += score
                    categories_len += 1

            categories_score /= categories_len
            final_rating += 0.1 * categories_score

            #extragem review-urile
            reviews = driver.find_elements(By.CSS_SELECTOR, '[data-testid="review-card"]')
            insert_reviews_for_hotel(hotel_name=hotel, reviews=reviews)
            negative_feedback_list = []
            positive_feedback_list = []
            title_list = []
            sum_rating = 0

            for r in reviews:
                try:
                    positive_feedback = "\n".join([
                        cb.text for cb in r.find_elements(By.CSS_SELECTOR, '[data-testid="review-positive-text"]') if
                        cb.text.strip()
                    ])
                except:
                    positive_feedback = ""

                try:
                    negative_feedback = "\n".join([
                        cb.text for cb in r.find_elements(By.CSS_SELECTOR, '[data-testid="review-negative-text"]') if
                        cb.text.strip()
                    ])
                except:
                    negative_feedback = ""

                try:
                    title = r.find_element(By.CSS_SELECTOR, '[data-testid="review-title"]').text
                except:
                    title = ""

                try:
                    review_rating = r.find_element(By.CSS_SELECTOR, '[data-testid="review-score"]').text.split('\n')
                    sum_rating += float(review_rating[1])
                except:
                    sum_rating += 0

                if positive_feedback:
                    positive_feedback_list.append(positive_feedback)

                if negative_feedback:
                    negative_feedback_list.append(negative_feedback)

                if title:
                    title_list.append(title)

            negative_feedback_score = 2 * negative_feedback_rating(negative_feedback=negative_feedback_list)
            positive_feedback_score = 2 * positive_feedback_rating(positive_feedback=positive_feedback_list)
            title_score = 2 * title_rating(title=title_list)
            review_rating_score = sum_rating/len(reviews)

            review_score = (negative_feedback_score + positive_feedback_score + title_score + review_rating_score)/4

            final_rating += 0.3 * review_score
            final_rating = math.trunc(final_rating * 100)/100
            insert_calculated_score(hotel_name=hotel, score=final_rating)

        except Exception as e:
            print(f" Eroare la hotelul '{hotel}': {e}")

    driver.quit()


def get_hotel_names() -> list[str]:
    engine = create_engine('postgresql://postgres:alberto12@localhost:5432/hotels')
    with engine.connect() as conn:
        result = conn.execute(text(f'SELECT "GlobalPropertyName" FROM "Hotels" LIMIT {50}'))
        hotels = [row[0] for row in result.fetchall()]
    return hotels


def insert_calculated_score(hotel_name, score):
    engine = create_engine('postgresql://postgres:alberto12@localhost:5432/hotels')
    Session = sessionmaker(bind=engine)
    session = Session()
    metadata = MetaData()
    metadata.reflect(bind=engine)

    calculatedScore_table = metadata.tables['CalculatedScore']
    hotel_table = metadata.tables['Hotels']

    hotel_id = session.execute(
        select(hotel_table.c.GlobalPropertyID).where(hotel_table.c.GlobalPropertyName == hotel_name)
    ).scalar()

    calculatedScore_id = session.execute(
        select(calculatedScore_table.c.id).where(calculatedScore_table.c.GlobalPropertyID == hotel_id)
    ).scalar()

    if not calculatedScore_id:
        # Inserează dacă nu există
        result = session.execute(
            calculatedScore_table.insert().values(GlobalPropertyID=hotel_id, score=score).returning(calculatedScore_table.c.id)
        )
        rating_id = result.scalar()

    session.commit()
def insert_reviews_for_hotel(hotel_name, reviews):
    engine = create_engine('postgresql://postgres:alberto12@localhost:5432/hotels')
    Session = sessionmaker(bind=engine)
    session = Session()
    metadata = MetaData()
    metadata.reflect(bind=engine)

    # Tabele
    review_table = metadata.tables['Reviews']
    hotel_table = metadata.tables['Hotels']

    hotel_id = session.execute(
        select(hotel_table.c.GlobalPropertyID).where(hotel_table.c.GlobalPropertyName == hotel_name)
    ).scalar()

    for r in reviews:
        try:
            review_info = r.find_element(By.CSS_SELECTOR, '[data-testid="review-stay-info"]')
            room = review_info.find_element(By.CSS_SELECTOR, '[data-testid="review-room-name"]').text
            nights = review_info.find_element(By.CSS_SELECTOR, '[data-testid="review-num-nights"]').text.split()
            date = review_info.find_element(By.CSS_SELECTOR, '[data-testid="review-stay-date"]').text
        except:
            room = ""
            date = ""
            nights = 0
        try:
            title = r.find_element(By.CSS_SELECTOR, '[data-testid="review-title"]').text
        except:
            title = ""

        try:
            rating = r.find_element(By.CSS_SELECTOR, '[data-testid="review-score"]').text.split('\n')
        except:
            rating = '0'

        try:
            positive_feedback = "\n".join([
                cb.text for cb in r.find_elements(By.CSS_SELECTOR, '[data-testid="review-positive-text"]') if
                cb.text.strip()
            ])
        except:
            positive_feedback = ""

        try:
            negative_feedback = "\n".join([
                cb.text for cb in r.find_elements(By.CSS_SELECTOR, '[data-testid="review-negative-text"]') if cb.text.strip()
            ])
        except:
            negative_feedback = ""

        review_id = session.execute(
            select(review_table.c.ReviewID).where(and_(
                review_table.c.GlobalPropertyID == hotel_id,
                review_table.c.Title == title,
                review_table.c.PositiveFeedback == positive_feedback
            ))
        ).scalar()

        if not review_id:
            # Inserează dacă nu există
            result = session.execute(
                review_table.insert().values(GlobalPropertyID=hotel_id, Title=title, Rating=float(rating[1]), TravelDate=date,
                                             PositiveFeedback=positive_feedback, NegativeFeedback=negative_feedback,
                                             NumberOfNights=int(nights[0]), RoomType=room)
                .returning(review_table.c.ReviewID)
            )
            rating_id = result.scalar()

        session.commit()

        print("\n------------------------")
        print(f"Informatii despre camera: {room}")
        print(f"Informatii despre nopti: {nights}")
        print(f"Informatii despre data: {date}")
        print(f"TITLU: {title}")
        print(f"SCOR: {rating}")
        print(f"POSITIV: {positive_feedback}")
        print(f"NEGATIV: {negative_feedback}")


def insert_rating_for_hotel(hotel_name, rating):
    engine = create_engine('postgresql://postgres:alberto12@localhost:5432/hotels')
    Session = sessionmaker(bind=engine)
    session = Session()
    metadata = MetaData()
    metadata.reflect(bind=engine)

    # Tabele
    rating_table = metadata.tables['Rating']
    hotel_table = metadata.tables['Hotels']

    hotel_id = session.execute(
        select(hotel_table.c.GlobalPropertyID).where(hotel_table.c.GlobalPropertyName == hotel_name)
    ).scalar()

        # 1. Verifică dacă există deja în FacilityTypes
    rating_id = session.execute(
        select(rating_table.c.id).where(rating_table.c.GlobalPropertyID == hotel_id)
    ).scalar()

    if not rating_id:
        # Inserează dacă nu există
        result = session.execute(
            rating_table.insert().values(GlobalPropertyID=hotel_id, rating=rating).returning(rating_table.c.id)
        )
        rating_id = result.scalar()

    session.commit()


def insert_facilities_for_hotel(hotel_name, facilities_list):
    engine = create_engine('postgresql://postgres:alberto12@localhost:5432/hotels')
    Session = sessionmaker(bind=engine)
    session = Session()
    metadata = MetaData()
    metadata.reflect(bind=engine)

    # Tabele
    facility_table = metadata.tables['facility_types']
    hotel_table = metadata.tables['Hotels']
    hotel_facility_table = metadata.tables['hotel_facilities']
    hotel_id = session.execute(
        select(hotel_table.c.GlobalPropertyID).where(hotel_table.c.GlobalPropertyName == hotel_name)
    ).scalar()

    for fac in facilities_list:
        # 1. Verifică dacă există deja în FacilityTypes
        fac_id = session.execute(
            select(facility_table.c.id).where(facility_table.c.name == fac)
        ).scalar()

        if not fac_id:
            # Inserează dacă nu există
            result = session.execute(
                facility_table.insert().values(name=fac).returning(facility_table.c.id)
            )
            fac_id = result.scalar()

        # 2. Inserează în HotelFacilities
        session.execute(hotel_facility_table.insert().values(
            GlobalPropertyID=hotel_id,
            facilityId=fac_id
        ))

    session.commit()


def insert_categories_for_hotel(hotel_name, categories_list):
    engine = create_engine('postgresql://postgres:alberto12@localhost:5432/hotels')
    Session = sessionmaker(bind=engine)
    session = Session()
    metadata = MetaData()
    metadata.reflect(bind=engine)

    # Tabele
    categories_table = metadata.tables['RatingCategories']
    hotel_table = metadata.tables['Hotels']
    hotel_categories_table = metadata.tables['HotelRatingCategories']
    hotel_id = session.execute(
        select(hotel_table.c.GlobalPropertyID).where(hotel_table.c.GlobalPropertyName == hotel_name)
    ).scalar()

    for c in categories_list:
        parts = c.text.strip().replace('\n', ' ')
        if parts:
            category = parts[0:-4]
            score = parts[-3:].replace(',', '.')
            # 1. Verifică dacă există deja în FacilityTypes
            c_id = session.execute(
                select(categories_table.c.id).where(categories_table.c.name == category)
            ).scalar()

            if not c_id:
                # Inserează dacă nu există
                result = session.execute(
                    categories_table.insert().values(name=category).returning(categories_table.c.id)
                    )
                c_id = result.scalar()

            # 2. Inserează în HotelFacilities
            session.execute(hotel_categories_table.insert().values(
                GlobalPropertyID=hotel_id,
                categoryId=c_id,
                score=float(score)
            ))

    session.commit()


if __name__ == '__main__':
    hotels = get_hotel_names()
    scrapping(hotels)
