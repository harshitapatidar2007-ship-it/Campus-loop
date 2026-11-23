#!/usr/bin/env python3
"""
CampusLoop Companion CLI & API Utility
Acropolis Institute Of Technology and Research
"""

import os
import sys
import json
import urllib.parse
from typing import Optional

def send_whatsapp_alert(phone: str, message: str, api_key: Optional[str] = None, phone_number_id: Optional[str] = None):
    """Generates direct WhatsApp link and optionally posts to Meta WhatsApp Cloud API."""
    clean_number = "".join(filter(lambda c: c.isdigit(), phone))
    if len(clean_number) == 10:
        clean_number = f"91{clean_number}"

    wa_link = f"https://wa.me/{clean_number}?text={urllib.parse.quote(message)}"
    print(f"[*] Generated Direct WhatsApp Link: {wa_link}")

    if api_key and phone_number_id:
        try:
            import requests
            url = f"https://graph.facebook.com/v19.0/{phone_number_id}/messages"
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }
            payload = {
                "messaging_product": "whatsapp",
                "to": clean_number,
                "type": "text",
                "text": {"preview_url": True, "body": message}
            }
            res = requests.post(url, headers=headers, json=payload, timeout=10)
            print(f"[+] WhatsApp Cloud API Status: {res.status_code}")
            return res.json()
        except Exception as e:
            print(f"[!] Error sending through WhatsApp Cloud API: {e}")
    else:
        print("[i] WhatsApp API credentials not provided; falling back to direct wa.me link.")

    return {"success": True, "waLink": wa_link}

def main():
    print("=====================================================")
    print(" CampusLoop CLI — Acropolis Institute Of Tech & Res")
    print("=====================================================")
    print("1. Test WhatsApp Borrow Alert")
    print("2. Exit")
    choice = input("\nEnter choice (1-2): ").strip()

    if choice == "1":
        phone = input("Enter Owner's WhatsApp Number (default: +919876543210): ").strip() or "+919876543210"
        item = input("Resource Title (default: Introduction to Algorithms): ").strip() or "Introduction to Algorithms"
        msg = f"Hello! I am requesting to borrow '{item}' from CampusLoop at AITR. Can we meet at Central Library?"
        api_key = os.getenv("WHATSAPP_API_KEY")
        phone_id = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
        send_whatsapp_alert(phone, msg, api_key, phone_id)
    else:
        print("Goodbye!")

if __name__ == "__main__":
    main()
