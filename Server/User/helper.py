from django.conf import settings
import requests
import smtplib
from email.message import EmailMessage


class MessageHandler2:
    def __init__(self, phone, body, subject) -> None:
        self.phone = phone
        self.body = body
        self.user = "piy42K@gmail.com"
        self.password = "uyec udvg ghuu hnib"
        self.msg = EmailMessage()
        self.msg["subject"] = subject
        self.msg.set_content(self.body)
        self.msg["to"] = self.phone
        self.msg["from"] = self.user

    def send_email(self):
        try:
            server = smtplib.SMTP("smtp.gmail.com", 587)
            server.starttls()
            server.login(self.user, self.password)
            server.send_message(self.msg)
            server.quit()
            print("Email sent successfully!")
        except Exception as e:
            print("Error:", str(e))
            print("Failed to send email.")


def notification(title, body, to):
    headers = {
        'authority': 'testfcm.com',
        'accept': 'application/json, text/plain, */*',
        'accept-language': 'en-US,en;q=0.9',
        'Content-Type': 'application/json;charset=UTF-8',
        'origin': 'https://testfcm.com',
        'referer': 'https://testfcm.com/',
    }

    json_data = {
        'postBody': {
            'notification': {
                "smallIcon": 'name-of-a-small-icon',
                'title': title,
                'body': body,
                'click_action': "https://admin.airyyrides.com",
                'icon': str("https://media.istockphoto.com/id/513247652/photo/panoramic-beautiful-view-of-mount-ama-dablam.jpg?s=1024x1024&w=is&k=20&c=ZKAEiIpjE9z6pmpZFVvnG_ymfsrZD7wFVPoB0LpLDYA="),
            },
            'data': None,
            'to': to,
        },
        'serverKey': 'AAAAA76frO8:APA91bG5_rlH0zyR1qZXEEjwH7bgvE2RSDoEAZpjfnTl_s00RO32f3-ea6NQj6V5nfUqEhN3V-nmVxUAyOS_uEbs8KR8dYVF6FeThswyTp62LG3Qb4vd4ZtAYLitv_EkCcL-_0beGEm_',
    }

    response = requests.post('https://testfcm.com/api/notify', headers=headers, json=json_data)
    
    if response.status_code == 200:
        print("Notification sent successfully")
    else:
        print(f"Failed to send notification. Status code: {response.status_code}, Response: {response.text}")
    
    return response

    
