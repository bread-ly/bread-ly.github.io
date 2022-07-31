class PDF {
    constructor(x, columnspace, organisation) {
        this.pdf = new jsPDF("p", "mm", "a4"); //Portrait und Maßeinheit Millimeter
        this.pdf.setFont("Arial");
        this.pdf.setFontSize(12);
        this.pageheight = this.pdf.internal.pageSize.height;
        this.pagewidth = this.pdf.internal.pageSize.width;
        this.space = columnspace;
        this.xc = x;
        this.pdfnum = 1;
        this.headerspace = 21;
        this.yc = columnspace + this.headerspace;
        this.org = organisation;
        this.date = date;
        this.Header();
    }
    Header() {
        this.pdf.text(this.org, 10, this.headerspace / 2 + 5);
        this.pdf.text("Inventur", this.pagewidth / 2 - 10, this.headerspace / 2 + 5);
        this.pdf.text(this.date, this.pagewidth - this.date.length * 3, this.headerspace / 2 + 5);
    }
    checkforheight() {
        if (this.pageheight - 14 < this.yc) {
            this.pdf.addPage();
            this.Header();
            this.yc = 14 + this.headerspace;
        }
    }
    Write(text) {
        this.checkforheight();
        this.pdf.text(text, this.xc, this.yc);
        this.yc = this.yc + this.space;
    }
    Line() {
        this.pdf.line(5, this.yc - 2, 200, this.yc - 2, "F");
        this.yc = this.yc + this.space;
    }
    Save(name) {
        this.pdf.save(name + this.pdfnum + ".pdf");
        this.pdfnum += 1;
    }
}