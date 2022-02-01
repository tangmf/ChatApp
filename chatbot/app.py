from flask import Flask, render_template, request,jsonify
from flask.scaffold import _matching_loader_thinks_module_is_package
#from flask_cors import CORS
from chat import get_response
import json
import requests
app = Flask(__name__)
# #CORS(app)



@app.route("/test", methods=["GET"])
 #@app.get("/")
def index_get():
    return render_template("python.ejs")

@app.route("/test2", methods=["GET", "POST"])
#@app.post("/predict")
def predict():
    print("this runs")
    text = requests.get_json().get("message")

    print(text)
#TODO: Check if text is valid
    response = get_response(text)
    message = {"answer": response}
    return jsonify(message)

if __name__ == "__main__":
    app.run(debug=True, port=3000)