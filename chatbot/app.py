from flask import Flask, render_template, request,jsonify
from flask.scaffold import _matching_loader_thinks_module_is_package
from flask_cors import CORS
from chat import get_response

app = Flask(__name__)
CORS(app)

@app.route("/", methods=["GET"])
 #@app.get("/")
def index_get():
    return render_template("index.ejs")

@app.route("/predict", methods=["GET", "POST"])
#@app.post("/predict")
def predict():
    print("this runs")
    text = request.get_json().get("message")

#TODO: Check if text is valid
    response = get_response(text)
    message = {"answer": response}
    return jsonify(message)

if __name__ == "__main__":
    app.run(debug=True, port=5001)