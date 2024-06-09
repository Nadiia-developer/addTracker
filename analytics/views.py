# from rest_framework.permissions import AllowAny
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
import json
import requests
from rest_framework import viewsets
from .models import Campaign, Offer, Click, Lead
from .serializers import (
    CampaignSerializer,
    OfferSerializer,
    ClickSerializer,
    LeadSerializer,
)


class CompaignViewSet(viewsets.ModelViewSet):
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer
    # permission_classes = [AllowAny]


class OfferViewSet(viewsets.ModelViewSet):
    queryset = Offer.objects.all()
    serializer_class = OfferSerializer
    # permission_classes = [AllowAny]


class ClickViewSet(viewsets.ModelViewSet):
    queryset = Click.objects.all()
    serializer_class = ClickSerializer
    # permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        url = request.data.get("url", "")
        user_agent = request.META.get("HTTP_USER_AGENT", "")
        ip_address = request.META.get("REMOTE_ADDR", "")
        offer_id = request.data.get("offer", None)

        if not offer_id:
            return Response(
                {"error": "Offer ID is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            offer = Offer.objects.get(id=offer_id)
        except Offer.DoesNotExist:
            return Response(
                {"error": "Offer does not exist"}, status=status.HTTP_404_NOT_FOUND
            )

        try:
            response = requests.get(f"http://ip-api.com/json/{ip_address}")
            data = response.json()
            geo_location = f"{data['city']}, {data['regionName']}, {data['country']}"
        except Exception as e:
            geo_location = "Unknown"

        click_data = Click(
            offer=offer,
            url=url,
            os=self.get_os_from_user_agent(user_agent),
            browser=user_agent,
            ip_address=ip_address,
            geo_location=geo_location,
        )
        click_data.save()

        serializer = self.get_serializer(click_data)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def get_os_from_user_agent(self, user_agent):
        if "Windows" in user_agent:
            return "Windows"
        elif "Mac" in user_agent:
            return "MacOS"
        elif "Linux" in user_agent:
            return "Linux"
        elif "Android" in user_agent:
            return "Android"
        elif "Iphone" in user_agent:
            return "iOS"
        else:
            return "Unknown"


class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer
    # permission_classes = [AllowAny]
