
//speech recognition
var speechRecognition = window.webkitSpeechRecognition

var recognition = new speechRecognition()

var textbox = $("#msg")

var instructions = $("#instructions")

var content = ''

recognition.continuous = true


//recognition started

recognition.onstart = function(){
  console.log("Voice")
  instructions.text("Voice recognition is on")
}

recognition.onspeechend = function(){
   instructions.text("No Activity")
}

recognition.onerror = function(){
    instructions.text("Try Again")
}

recognition.onresult = function(event){
    var current = event.resultIndex;

    var transcript = event.results[current][0].transcript

    content += transcript

    textbox.val(content)
}

$("#start-btn").click(function(event){
  if(content.length){
    content += ''
  }

  recognition.start()
})

textbox.on('Input', function(){
    content = $(this).val()
})
