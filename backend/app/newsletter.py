# trzeba podlaczyc
from email.message import EmailMessage
import ssl
import smtplib
from dotenv import load_dotenv
import os
load_dotenv()
em_send = 'promptowrld.news@gmail.com' 
em_password = os.getenv('GMAIL_PASSWORD')
subject = "Your monthly promptworld newsletter is here!"
body = """We want to recommend you some products"""
em_receiver = 'mikolaj.43289@gmail.com'


email = EmailMessage()
email['From'] = em_send
email['To'] = em_receiver
email['Subject'] = subject
email.set_content(body)

context = ssl.create_default_context()
with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as smtp:
    smtp.login(em_send, em_password)
    smtp.sendmail(em_send, em_receiver, email.as_string())
