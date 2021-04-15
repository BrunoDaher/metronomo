
var metro = null;
var bpm = $("#bpm").val();
var i = 0;
var compassos = 4;

//triggers
$("#bpm").change(function(){                    
    bpm = this.value;
    $("#lbpm").text(this.value + "  BPM");
    
    stop();
    $("#metroOn").focus();
    metro = setInterval(start, 60/bpm * 1000);
} );     

$("input:radio[name='pulsos']").change( () => setComp());

$("#metroOn").click(function(){                        
    // console.log('iniciado');  
    stop();              
    metro = setInterval(start, 60/bpm * 1000);
});


$("#metroOff").click( () => stop());

function setComp(){            
    //compassos = $(".compassos :selected").val();             
    compassos = $('input[name="pulsos"]:checked').val();                                    
}

//funcoes
function stop(){
    window.clearInterval(metro);                              
    for(x=1;x<(compassos + 1);x++){
        //reset style
        $("#p" + x).removeClass('pulse');
    }        
    i=0;  
}

function start(){
    //ternario
    i<compassos?i++:i=1;
    fig(i);        
}

function fig(i){                            
    setTimeout(mark,150);
    mark();
}

function mark(){            
    $("#p" + i).toggleClass('pulse');                                
}