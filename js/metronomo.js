
let metronomo = null;
let bpm = $("#bpm").val();
let i = 0;
let pulsos = 4;

//triggers
$("#bpm").change(function(){                    
    bpm = this.value;
    stop()
    $("#lbpm").text(this.value + "  BPM");   
    metronomo = setInterval(start, 60/bpm * 1000);
} );     

//pulsações
$("input:radio[name='pulsos']").change( () => setComp());

$("#qtdPulsos").change(setComp);

//on off
$("#metroOn").click(function(){                        
    stop();
    $(this).addClass('active')        
    metronomo = setInterval(start, 60/bpm * 1000);
});

$("#metroOff").click(function(){
    stop();
    $(this).addClass('active');  
});

function setComp(){     
      pulsos = this.value   
    //compassos = $(".compassos :selected").val();             
    //compassos = $('input[name="pulsos"]:checked').val();    
  //  $('button').removeClass('active');     
                          
}

//funcoes
function stop(){   
    $('button').removeClass('active');  
    window.clearInterval(metronomo);        
}

function start(){
    //ternario
    $("#metroOn").addClass('active');    
    i<pulsos?i++:i=1;

    //setTimeout(play,0);
    
    play();
        
    function play(){
     playNote(i==1?'100':'110','sine',i==1?'160':'30');   
    }
    
    fig();        
}

function fig(){                            
    setTimeout(mark,120);
    mark();
}

function mark(){           
    
    $("#p" + i).toggleClass('active');                                
}
