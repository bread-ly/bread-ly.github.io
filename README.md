# bread-ly.github.io
This is a website for my diploma thesis.
We are constructed to create an inventory scanner for the local FIrefighters.
# Dependencies
The Website uses the https://github.com/mebjas/html5-qrcode Barcode Reader, it has to be loaded.
It is also using the https://github.com/parallax/jsPDF PDF Creation tool for JavaScript.
# Data-file
For the Data File we use JSONp whit the following format.

date = '{"id":{"4/1":{"Name":"sample1"...},"4/2":{"Name":"sample2"...}}}';

This file is initialized by scanning a QR-code with the link to the raw file.
# Insctruction/Initialization
For setting the name of the cookie with the database-link. Change the string in the Object creation.
const DataBase = new Cookies(cookiename);

After setting the cookie for the database-link, there are created 3 cookie objects that are used to save the scanned Data when doing an inventory.
const InvScanned = new Cookies(scanneddata);
const InvComp = new Cookies(comparedata);
const InvReal = new Cookies(realdata);
The string that is given, is only the name of the cookie.

Create PDF:
For the creation of the PDF jspdf is used, i made a class for simlper access.
When creatting the object, hand over the x coordinate that the text is printed at, the space beetween two collumns and the Organisation name for the PDF-head.
const pdf = new PDF(x-coordinate, collumnspace, organisation);
