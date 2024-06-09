from django.db import models


class Campaign(models.Model):
    name = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField()
    goal = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.name} - {self.start_date} - {self.end_date}"


class Offer(models.Model):
    name = models.CharField(max_length=255)
    url = models.URLField()
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.name} for {self.campaign.name}"


class Click(models.Model):
    offer = models.ForeignKey(Offer, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    url = models.URLField()
    os = models.CharField(max_length=50)
    browser = models.CharField(max_length=100)
    ip_address = models.GenericIPAddressField()
    geo_location = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"{self.url} clicked on {self.timestamp}"


class Lead(models.Model):
    click = models.ForeignKey(Click, on_delete=models.CASCADE)
    user = models.CharField(max_length=255)
    interest_level = models.CharField(max_length=50)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Lead by {self.user} with interest level {self.interest_level} at {self.timestamp}"
