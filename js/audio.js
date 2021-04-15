
var audioContext = new AudioContext();

function playNote(frequency, type, amp) {
    //som pulsado
    //audioContext = new AudioContext();
    
     setTimeout(function(){    
          o = audioContext.createOscillator();
          g = audioContext.createGain();
          o.type = type;
          o.connect(g);
          o.frequency.value = frequency;
          g.connect(audioContext.destination);
          o.start();
          g.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.1 );                                                         // volume , sustain
          g.gain.setValueAtTime((g.gain.value*amp)/frequency,audioContext.currentTime);      
      },0)  

      
}    


