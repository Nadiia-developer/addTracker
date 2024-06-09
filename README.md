# Development of tracker for web analytics

### Campaign Dashboard built using DRF, React and Chart.js

## Installing using GitHub

*Clone project from [GitHub](https://github.com/Nadiia-developer/addTracker.git)*

git clone https://github.com/Nadiia-developer/addTracker.git

> ### *Windows PowerShell / Mac Terminal*
> python -m venv venv
> 
> venv\Scripts\activate (Windows PowerShell)
> 
> sourse venv\bin\activate (Mac Terminal)
> 
> pip install -r requirements.txt
> 
> python manage.py migrate
>
> ### *Run the Django Development Server:*
> python manage.py runserver
> ### *Run the React Development Server:*
> npm start

> ### *Getting access*
> 
> Endpoints to create campaigns, offers, clicks, leads:
> - api/campaigns
> - api/offers
> - api/clicks
> - api/leads



> ### *Features*
> 
> Documentation is located:
> - api/swagger/
> - 
> The chart visualizes the following metrics for each campaign:
> - Offer Counts
> - Click Counts
> - Lead Counts
> - Revenue
> - EPC
> 
> The component also supports filtering and sorting of campaign data:
> - An input field allows users to filter campaigns by name.
> - A dropdown allows users to sort campaigns by name or number of clicks.

> Managing campaigns, offers, clicks and leads
>
> - Creating campaign with name, start date, end date, goal;
> - Creating offer with name, url, campaign;
> - Creating click with timestamp, url, os, browser, ip address, geo location, offer;
> - Creating lead with user, interest level, timestamp, click.


