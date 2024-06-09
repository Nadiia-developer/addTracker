from django.contrib import admin
from .models import Campaign, Offer, Click, Lead


class LeadAdmin(admin.ModelAdmin):
    list_display = ("click", "user", "interest_level")
    search_fields = ("user", "interest_level")


admin.site.register(Campaign)
admin.site.register(Offer)
admin.site.register(Click)
admin.site.register(Lead, LeadAdmin)
