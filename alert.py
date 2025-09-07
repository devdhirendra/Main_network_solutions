#!/usr/bin/env python3
import os
import smtplib
import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Configuration
ARCHIVE_PATH = "/dhirendra/ticket_management/data/archive"
SMTP_SERVER = "webmail.comviva.com"
SMTP_PORT = 25
SENDER_EMAIL = "ps-automation@comviva.com"
TEST_MODE = True  # Set to False for production

# File patterns (without dates)
FILE_PATTERNS = {
    "MTN_Momo_INC_Ticket_Dump": "MTN_Momo_INC_Ticket_Dump",
    "MTN_Momo_SR_Ticket_Dump": "MTN_Momo_SR_Ticket_Dump",
    "MTN_UGANDA_Ticket_Dump": "MTN_UGANDA_Ticket_Dump",
    "MTN_NIGERIA_Ticket_Dump": "MTN_NIGERIA_Ticket_Dump",
    "Airtel_Smshub_Oman_Ticket": "Airtel_Smshub_Oman_Ticket",
    "Airtel_Smshub_IM_Ticket": "Airtel_Smshub_IM_Ticket",
    "Airtel_Smshub_Service_Now_Ticket": "Airtel_Smshub_Service_Now_Ticket",
    "Airtel_Smshub_Ticket": "Airtel_Smshub_Ticket",
    "Airtel_Africa_Ticket_Dump": "Airtel_Africa_Ticket_Dump",
    "Ooredoo_Kuwait_RBT": "Ooredoo_Kuwait_RBT_Ticket_Dump",
    "MTN_UNO_Ticket_Dump": "MTN_UNO_Ticket_Dump",
    "MTN_DSM_Ticket_Dump": "MTN_DSM_Ticket_Dump",
    "MOBILY_LMS_Ticket_Dump": "MOBILY_LMS_Ticket_Dump",
    "BMC_Ticket_DUMP": "BMC_Ticket_DUMP",
    "Yesterday_Incidents": "Yesterday_Incidents",
    "Tata_Play_Binge_D-1_CRM_Ticket_Dump": "Tata_Play_Binge_D-1_CRM_Ticket_Dump",
    "JIO_SE_CG_Ticket": "JIO_SE_CG_Ticket"
}

# Recipients mapping
RECIPIENTS = {
    "MTN_Momo_INC_Ticket_Dump": ["kunal.wadhwa@comviva.com", "sudipt.kumar@comviva.com", "vimal.sethia@comviva.com"],
    "MTN_Momo_SR_Ticket_Dump": ["kunal.wadhwa@comviva.com", "sudipt.kumar@comviva.com", "vimal.sethia@comviva.com"],
    "MTN_UGANDA_Ticket_Dump": ["vikas.tiwari1@comviva.com", "pankaj.durga@comviva.com"],
    "MTN_NIGERIA_Ticket_Dump": ["vikas.tiwari1@comviva.com", "pankaj.durga@comviva.com"],
    "Airtel_Smshub_Oman_Ticket": ["amit.kumar10@comviva.com", "rishikanta.das@comviva.com", "arpit.shah@comviva.com"],
    "Airtel_Smshub_IM_Ticket": ["amit.kumar10@comviva.com", "rishikanta.das@comviva.com", "arpit.shah@comviva.com"],
    "Airtel_Smshub_Service_Now_Ticket": ["amit.kumar10@comviva.com", "rishikanta.das@comviva.com", "arpit.shah@comviva.com"],
    "Airtel_Smshub_Ticket": ["amit.kumar10@comviva.com", "rishikanta.das@comviva.com", "arpit.shah@comviva.com"],
    "Airtel_Africa_Ticket_Dump": ["shivam.mishra@comviva.com", "anuj.chauhan1@comviva.com", "amit.sajwan@comviva.com"],
    "Ooredoo_Kuwait_RBT_Ticket_Dump": ["vikas.tiwari1@comviva.com", "pankaj.durga@comviva.com"],
    "MTN_UNO_Ticket_Dump": ["deepak.sharma5@comviva.com", "abhishek.pandey@comviva.com", "vimal.sethia@comviva.com"],
    "MTN_DSM_Ticket_Dump": ["deepak.sharma5@comviva.com", "abhishek.pandey@comviva.com", "vimal.sethia@comviva.com"],
    "MOBILY_LMS_Ticket_Dump": ["deepak.sharma5@comviva.com", "abhishek.pandey@comviva.com", "vimal.sethia@comviva.com"],
    "BMC_Ticket_DUMP": ["rajni.kant@comviva.com"],
    "Yesterday_Incidents": ["sonali.panda@comviva.com", "vivek.gauraw@comviva.com"],
    "Tata_Play_Binge_D-1_CRM_Ticket_Dump": ["sonali.panda@comviva.com", "vivek.gauraw@comviva.com"],
    "JIO_SE_CG_Ticket": ["yashwant.singh@comviva.com", "roshan.kumar@comviva.com"]
}

# Subject mapping
SUBJECTS = {
    "MTN_Momo_INC_Ticket_Dump": "MTN Momo INC Tickets Not Received",
    "MTN_Momo_SR_Ticket_Dump": "MTN Momo SR Tickets Not Received",
    "MTN_UGANDA_Ticket_Dump": "MTN Uganda Tickets Not Received",
    "MTN_NIGERIA_Ticket_Dump": "MTN Nigeria Tickets Not Received",
    "Airtel_Smshub_Oman_Ticket": "SMSHUB Oman Tickets Not Received",
    "Airtel_Smshub_IM_Ticket": "SMSHUB(IM) Tickets Not Received",
    "Airtel_Smshub_Service_Now_Ticket": "SMSHUB(ServiceNow) Tickets Not Received",
    "Airtel_Smshub_Ticket": "SMSHUB(Sibel) Tickets Not Received",
    "Airtel_Africa_Ticket_Dump": "Airtel Africa Tickets Not Received",
    "Ooredoo_Kuwait_RBT_Ticket_Dump": "Ooredoo Kuwait Tickets Not Received",
    "MTN_UNO_Ticket_Dump": "MTN UNO Tickets Not Received",
    "MTN_DSM_Ticket_Dump": "MTN DSM Tickets Not Received",
    "MOBILY_LMS_Ticket_Dump": "Mobiliy LMS Tickets Not Received",
    "BMC_Ticket_DUMP": "BMC PS D-1 Tickets Not Received",
    "Yesterday_Incidents": "Tata Play OneDesk Ticket Not Received",
    "Tata_Play_Binge_D-1_CRM_Ticket_Dump": "Tata Play CRM Ticket Not Received",
    "JIO_SE_CG_Ticket": "R JIO Tickets Not Received"
}

# Product names mapping
PRODUCT_NAMES = {
    "MTN_Momo_INC_Ticket_Dump": "MTN MoMo",
    "MTN_Momo_SR_Ticket_Dump": "MTN MoMo",
    "MTN_UGANDA_Ticket_Dump": "MTN Uganda",
    "MTN_NIGERIA_Ticket_Dump": "MTN Nigeria",
    "Airtel_Smshub_Oman_Ticket": "SMSHUB Oman",
    "Airtel_Smshub_IM_Ticket": "SMSHUB",
    "Airtel_Smshub_Service_Now_Ticket": "SMSHUB",
    "Airtel_Smshub_Ticket": "SMSHUB",
    "Airtel_Africa_Ticket_Dump": "Airtel Africa",
    "Ooredoo_Kuwait_RBT_Ticket_Dump": "Ooredoo Kuwait",
    "MTN_UNO_Ticket_Dump": "MTN UNO",
    "MTN_DSM_Ticket_Dump": "MTN DSM",
    "MOBILY_LMS_Ticket_Dump": "Mobiliy LMS",
    "BMC_Ticket_DUMP": "BMC",
    "Yesterday_Incidents": "Tata Play",
    "Tata_Play_Binge_D-1_CRM_Ticket_Dump": "Tata Play",
    "JIO_SE_CG_Ticket": "R JIO"
}

# Common CC recipients
CC_RECIPIENTS = ["dhirendra.ojha@comviva.com", "sanjay.dudeja@comviva.com", 
                 "gaurav.agarwal@comviva.com", "divyank.kumar@comviva.com"]

def check_files():
    """Check which files are missing based on filename patterns"""
    missing_files = {}
    
    # Get all files in the archive directory
    try:
        all_files = os.listdir(ARCHIVE_PATH)
    except FileNotFoundError:
        print(f"Error: Directory {ARCHIVE_PATH} not found")
        return {}
    except PermissionError:
        print(f"Error: Permission denied to access {ARCHIVE_PATH}")
        return {}
    
    # Check each pattern
    for file_key, pattern in FILE_PATTERNS.items():
        found = False
        for filename in all_files:
            if pattern in filename:
                found = True
                break
        
        if not found:
            missing_files[file_key] = pattern
    
    return missing_files

def send_email(to_list, cc_list, subject, body):
    """Send email using SMTP"""
    if TEST_MODE:
        to_list = ["dhirendra.ojha@comviva.com"]
        cc_list = []
        subject = f"[TEST] {subject}"
    
    # Create message
    msg = MIMEMultipart()
    msg['Subject'] = subject
    msg['From'] = SENDER_EMAIL
    msg['To'] = ", ".join(to_list)
    if cc_list:
        msg['Cc'] = ", ".join(cc_list)
    
    # Add HTML body
    msg.attach(MIMEText(body, 'html'))
    
    # Combine to and cc recipients
    all_recipients = to_list + cc_list
    
    try:
        # Send email
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.sendmail(SENDER_EMAIL, all_recipients, msg.as_string())
        print(f"Alert email sent for: {subject}")
        return True
    except Exception as e:
        print(f"Failed to send email: {str(e)}")
        return False

def generate_alert_table(missing_files):
    """Generate HTML table with only missing files highlighted in red"""
    current_date = datetime.datetime.now().strftime("%Y-%m-%d")
    
    # Use double curly braces to escape the format placeholders in CSS
    html = f"""
    <html>
    <head>
    <style>
    table {{
        border-collapse: collapse;
        width: 100%;
        font-family: Arial, sans-serif;
    }}
    th, td {{
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
    }}
    th {{
        background-color: #f2f2f2;
        font-weight: bold;
    }}
    .missing {{
        color: #ff0000;
        font-weight: bold;
    }}
    </style>
    </head>
    <body>
    <h2 style="color: #ff0000;">Alert: Files Not Received - {current_date}</h2>
    <p>The following files were not received today:</p>
    <table>
    <tr>
        <th>Date</th>
        <th>Product</th>
        <th>Status</th>
    </tr>
    """
    
    # Add rows for only missing files
    for file_key, pattern in missing_files.items():
        html += f"""
        <tr>
            <td>{current_date}</td>
            <td>{PRODUCT_NAMES.get(file_key, file_key)}</td>
            <td class='missing'>MISSING</td>
        </tr>
        """
    
    html += """
    </table>
    <br>
    <p>Please check why these files were not sent and take appropriate action.</p>
    </body>
    </html>
    """
    
    return html

def main():
    print("Starting file monitoring at", datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    print("Checking directory:", ARCHIVE_PATH)
    
    # Check for missing files
    missing_files = check_files()
    
    # Only send alerts if files are missing
    if missing_files:
        print(f"Found {len(missing_files)} missing files. Sending alerts...")
        
        # Send individual alerts for each missing file
        for file_key, pattern in missing_files.items():
            to_list = RECIPIENTS.get(file_key, [])
            subject = SUBJECTS.get(file_key, "File Not Received")
            product_name = PRODUCT_NAMES.get(file_key, file_key)
            
            # Create email body with red alert
            body = f"""
            <html>
            <body>
            <p style="color: #ff0000; font-weight: bold;">Hi Team,</p>
            <p style="color: #ff0000; font-weight: bold;">{product_name} ticket data is not received today. Please check why this is not sent.</p>
            <p><strong>Missing File Pattern:</strong> {pattern}</p>
            <p><strong>Expected Path:</strong> {ARCHIVE_PATH}/</p>
            <p><strong>Check Time:</strong> {datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")}</p>
            </body>
            </html>
            """
            
            # Send email
            send_email(to_list, CC_RECIPIENTS, subject, body)
        
        # Generate and send summary alert email
        summary_subject = f"URGENT: {len(missing_files)} Files Not Received Today"
        summary_body = generate_alert_table(missing_files)
        
        # Send summary to yourself and CC recipients
        send_email(["dhirendra.ojha@comviva.com"], CC_RECIPIENTS, summary_subject, summary_body)
        print(f"Summary alert sent for {len(missing_files)} missing files")
    else:
        print("All files received successfully. No alerts needed.")
    
    print("File monitoring completed at", datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

if __name__ == "__main__":
    main()