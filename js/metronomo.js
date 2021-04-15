
let metro = null;
let bpm = $("#bpm").val();
let i = 0;
let compassos = 4;

//triggers
$("#bpm").change(function(){                    
    bpm = this.value;
    stop()
    $("#lbpm").text(this.value + "  BPM");   
    metro = setInterval(start, 60/bpm * 1000);
} );     

//pulsações
$("input:radio[name='pulsos']").change( () => setComp());

//on off
$("#metroOn").click(function(){                        
    // console.log('iniciado');  
    stop();
    $(this).addClass('active')        
    metro = setInterval(start, 60/bpm * 1000);
});

$("#metroOff").click( 
    function(){
        stop();
         $(this).addClass('active');  
        }
    );

function setComp(){            
    //compassos = $(".compassos :selected").val();             
    compassos = $('input[name="pulsos"]:checked').val();    
    $('button').removeClass('active');                                  
}

//funcoes
function stop(){   
    $('button').removeClass('active');  
    window.clearInterval(metro);        
}

function start(){
    //ternario
    $("#metroOn").addClass('active');    
    i<compassos?i++:i=1;
    fig(i);        
}

function fig(i){                            
    setTimeout(mark,150);
    mark();
}

function mark(){            
    $("#p" + i).toggleClass('active');                                
}
