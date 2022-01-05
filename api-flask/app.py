from flask import Flask, render_template, request, redirect, url_for, flash

app = Flask(__name__)
  

class Tabla():
    """docstring for tabla"""
    def __init__(self,items,per_page,nro_page):
        self.items =items
        self.total_items = len(items)
        self.per_page = per_page
        self.nro_page = nro_page

    def pagination(self):
        self.item_start = self.get_start_item()
        self.item_fin = self.get_fin_item()
        self.cant_pages = self.cant_pages()
        self.items = self.items[self.item_start-1:self.item_fin]
        self.keys = self.get_keys(self.items)

        return {"keys":self.keys ,"items":self.items,"item_start":self.item_start,"item_fin":self.item_fin,
                "cant_pages":self.cant_pages,"total_items":self.total_items,"has_next":self.has_next(),
                "has_previous":self.has_previous()}

        
    def cant_pages(self):
        return self.total_items//self.per_page + (1 if self.total_items % self.per_page else 0)

    def get_start_item(self):
        if (self.nro_page-1)*self.per_page >= self.total_items:
            return 0
        else:
            return (self.nro_page -1)*self.per_page + 1

    #OPTIMIZAR
    def get_fin_item(self):
        if (self.nro_page-1)*self.per_page >= self.total_items:
            return 0
        else: 
            if self.total_items < self.nro_page *self.per_page:
                return self.total_items
            else:
                return self.nro_page*self.per_page

    def has_next(self):
        return f"?page={self.nro_page+1}&per-page={self.per_page}"if self.nro_page*self.per_page < self.total_items else False
        #return True if self.item_fin < self.total_items else False

    def has_previous(self):
        return f"?page={self.nro_page-1}&per-page={self.per_page}" if self.item_start > 1 else False
        #return True if self.item_start > 1 else False

    def get_keys(self,items):
        keys =[]
        for item in items:
            for key in item:
                if not key in keys:
                    if key=="id":
                        keys.insert(0,key)
                    else:
                        keys.insert(1,key)
        
        return keys


items = [{"id":1,"name":"Victor","email":"victor.saul.ca@gmail.com","phone":961231097},
        {"id":2,"name":"hECTOR","email":"victor.saul.ca@gmail.com","phone":961231097},
        {"id":3,"name":"Victor1","email":"victor.saul.ca@gmail.com","phone":961231097},
        {"id":4,"name":"Victor2","email":"victor.saul.ca@gmail.com","phone":961231097},
        {"id":5,"name":"Victor3","email":"victor.saul.ca@gmail.com","phone":961231097},
        {"id":6,"name":"Victor4","email":"victor.saul.ca@gmail.com","phone":961231097},
        {"id":7,"name":"Victor5","email":"victor.saul.ca@gmail.com","phone":961231097},
        {"id":8,"name":"saul","email":"victor.saul.ca@gmail.com","phone":961231097},
        {"id":9,"name":"SAUL","email":"victor.saul.ca@gmail.com","phone":961231097},
        {"id":10,"name":"Carlos","email":"victor.saul.ca@gmail.com","phone":961231097},]

@app.route('/api/')
def index():
    page = int(request.args["page"])
    per_page = int(request.args["per-page"])
    data=Tabla(items,per_page,page).pagination()
    print(data)
    return render_template('index.html', employee = data)
 
@app.route('/add_contact', methods=['POST'])
def add_employee():
    conn = mysql.connect()
    cur = conn.cursor(pymysql.cursors.DictCursor)
    if request.method == 'POST':
        fullname = request.form['fullname']
        phone = request.form['phone']
        email = request.form['email']
        cur.execute("INSERT INTO employee (name, email, phone) VALUES (%s,%s,%s)", (fullname, email, phone))
        conn.commit()
        flash('Employee Added successfully')
        return redirect(url_for('Index'))
 
@app.route('/edit/<id>', methods = ['POST', 'GET'])
def get_employee(id):
    conn = mysql.connect()
    cur = conn.cursor(pymysql.cursors.DictCursor)
  
    cur.execute('SELECT * FROM employee WHERE id = %s', (id))
    data = cur.fetchall()
    cur.close()
    print(data[0])
    return render_template('edit.html', employee = data[0])
 
@app.route('/update/<id>', methods=['POST'])
def update_employee(id):
    if request.method == 'POST':
        fullname = request.form['fullname']
        phone = request.form['phone']
        email = request.form['email']
        conn = mysql.connect()
        cur = conn.cursor(pymysql.cursors.DictCursor)
        cur.execute("""
            UPDATE employee
            SET name = %s,
                email = %s,
                phone = %s
            WHERE id = %s
        """, (fullname, email, phone, id))
        flash('Employee Updated Successfully')
        conn.commit()
        return redirect(url_for('Index'))
 
@app.route('/delete/<string:id>', methods = ['POST','GET'])
def delete_employee(id):
    conn = mysql.connect()
    cur = conn.cursor(pymysql.cursors.DictCursor)
  
    cur.execute('DELETE FROM employee WHERE id = {0}'.format(id))
    conn.commit()
    flash('Employee Removed Successfully')
    return redirect(url_for('Index'))
 
# starting the app
if __name__ == "__main__":
    app.run(port=3000, debug=True)

