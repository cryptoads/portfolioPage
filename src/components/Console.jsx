import React, { Component } from 'react';
import Typist from 'react-typist';



class Console extends Component {
    constructor(props){
    super(props)

    this.state= {
      showName: {opacity: 0},
      name: false,
      color: "white",
      keyColor: false,
      keyClass: "generic",
      description: false,
      newCmd: false,
      fetch: false,
      newCmdVis: 0,
      endLine: false,
      github: false,
      projHolder: {visibility: 'hidden', animation: 'fadein 1s linear', opacity: 0},
      show: false,
      endline: false,
      comp: true,
     
    }
  }

 
showName(){
    this.setState({ showName: {opacity: 1}, name: true})
}

showColor(){
    this.setState({ color: "#50d8ec", keyColor: true})

}

showKeyColor(){
    this.setState({ keyClass: "keyColor", description: true})
}


scroller(){
    document.getElementById("MyDivElement").scrollTop = 9999999;   
}

nextCmd(){
    this.setState({newCmd: true, nextCmd:true, newCmdVis: .8})
}

fetch(){
    this.setState({fetch:true})
}

endLine(){
    this.setState({endLine:true})
}

projHolder(){
    this.setState({projHolder: { visibility: 'visible', animation: 'fadein 2s linear', opacity: .8}})
}

github(){
    this.setState({github:true})
}

showModal(){
    this.setState({show:true})
}

hideModal(){
    this.setState({show:false})
}

finish(){
    this.setState({
        comp:!this.state.comp, 
        showName: {opacity: 1}, 
        github: true,
        projHolder: { visibility: 'visible', animation: 'fadein 2s linear', opacity: .8},
        newCmdVis: .8,
        keyClass: "keyColor",
        color: "#50d8ec", 
        fetch: false,
        description: false,
        name: false,
        keyColor: false,
        newCmd: false,
        endLine: false,
        nextCmd: true
        });
    this.scroller()
}


 render(){
    let thefetch= ".then(res()=>{res.json();})"
    let colorString = "{ color: #50d8ec; }";
    let keyValueString = "{ color: #f008b7; }"
    let bracket = "{"
    let prevProj = ".previousProjects { visibility: visible; }"

  return (



       <div className="container-fluid" >
         
        <div className="row justify-content-between mb-5 toprow">
            <div className="col-lg-6 col-md-12 ml-auto">
                <h1 className="victory" style={this.state.showName}><code>Chris Michels</code></h1>
                
            </div>
            <div className="col-lg-5 col-md-12 mt-5 mr-auto ">
            <div className="console " id="MyDivElement">
            <button className="fastFinish" onClick={this.finish.bind(this)}> <span className="finishSpan">HURRY UP</span></button>


             {this.state.comp ? 
                <Typist onTypingDone={this.showName.bind(this)}  stdTypingDelay={50} cursor={{ hideWhenDone: true, hideWhenDoneDelay: 0, element: '_' }}> 
              <span> HELLO </span>
              <br />
               <Typist.Delay ms={500} />
                <span>MY NAME IS CHRIS MICHELS</span> 
                <br />
                <Typist.Delay ms={1500} />LET'S TALK ABOUT ME, THAT'S WHY YOU ARE HERE, RIGHT?
                <Typist.Delay ms={1500} />

            </Typist> : 
            <div>
            <span>HELLO</span>
            <br/>
            <span>MY NAME IS CHRIS MICHELS</span> 
            <br />
            <span>LET'S TALK ABOUT ME, THAT'S WHY YOU ARE HERE, RIGHT?</span>
            <br />
                <div className="code" style={{color: this.state.color}}>           
                    <br />
                    <span>.code {colorString}</span>
                </div>
                <div className={this.state.keyClass} > 
                    <span>.keyValues {keyValueString}</span>
                    <br />
                </div>
                 <div className="code generic"  style={{color: this.state.color}}> 
                    <br />
                    <span>fetch('/aboutChris')</span>
                    <span>{thefetch}</span> 
                    <br /> 
                    <br />
                    <span>{bracket}</span>
                    <br />
                    <span>description:</span><span className="keyColor"> 'Full Stack Developer',</span>
                    <br />
                     <span>location:</span><span className="keyColor"> 'Atlanta, GA',</span>
                    <br />
                    <span>skills:</span>
                    <br />
                    <span className="indent">{bracket}</span>
                    <br />
                    <span className="indent">HTML:</span>
                    <span className="keyColor"> true,</span>
                    <br />
                    <span className="indent">CSS:</span><span className="keyColor"> true,</span>
                    <br />
                </div>
                <div className="code generic"  style={{color: this.state.color}}> 
                    <span className="indent">JS:</span><span className="keyColor"> true,</span>
                    <br />
                    <span className="indent">React:</span><span className="keyColor"> true,</span>
                    <br />
                    <span className="indent">NodeJS:</span><span className="keyColor"> true,</span>
                    <br />
                    <span className="indent">SQL:</span><span className="keyColor"> true,</span>
                    <br />
                    <span className="indent">Git:</span><span className="keyColor"> true,</span>
                    <br />
                    <span className="indent">}</span>
                    <br />
                    <span>}</span>
                    <br />
                </div>
                <div className="code generic"  style={{color: this.state.color}}> 
                    <br />
                    <span style={{color: "white"}}>start contact.cmd</span>
                </div>
                <div className="code generic"  style={{color: this.state.color}}> 
                    <br />
                    <span>{prevProj}</span>
                    <br />
                </div>
                
            </div> }


                 {this.state.name ? 
                    <div className="code" style={{color: this.state.color}}> 
                        <Typist onTypingDone={this.showColor.bind(this)} cursor={{ hideWhenDone: true, hideWhenDoneDelay: 0, element: '_' }}>
                        <br />
                        <span>.code {colorString}</span>
                        </Typist>
                        </div>
                : ""} 
               

                {this.state.keyColor ?
                    <div className={this.state.keyClass} > 
                        <Typist onTypingDone={this.showKeyColor.bind(this)} cursor={{ hideWhenDone: true, hideWhenDoneDelay: 0, element: '_' }}>
                        <span>.keyValues {keyValueString}</span>
                        <br />
                        </Typist>
                        </div>
                 : ""}


                {this.state.description ?
                    <div className="code generic"  style={{color: this.state.color}}> 
                        <Typist onLineTyped={this.scroller.bind(this)} onTypingDone={this.fetch.bind(this)} cursor={{ hideWhenDone: true, hideWhenDoneDelay: 0, element: '_' }}>
                        <br />
                        <span>fetch('/aboutChris')</span>
                        <span>{thefetch}</span> 
                        <br /> 
                        <br />
                        <span>{bracket}</span>
                        <br />
                        <span>description:</span><span className="keyColor"> 'Full Stack Developer',</span>
                        <br />
                         <span>location:</span><span className="keyColor"> 'Atlanta, GA',</span>
                        <br />
                        <span>skills:</span>
                        <br />
                        <span className="indent">{bracket}</span>
                        <br />
                        <span className="indent">HTML:</span>
                        <span className="keyColor"> true,</span>
                        <br />
                        <span className="indent">CSS:</span><span className="keyColor"> true,</span>
                        <br />
                        </Typist>
                    </div>
                :""}



                {this.state.fetch ? 
                    <div className="code generic"  style={{color: this.state.color}}> 
                        <Typist onLineTyped={this.scroller.bind(this)} onTypingDone={this.endLine.bind(this)} cursor={{ hideWhenDone: true, hideWhenDoneDelay: 0, element: '_' }}>
                        <span className="indent">JS:</span><span className="keyColor"> true,</span>
                        <br />
                        <span className="indent">React:</span><span className="keyColor"> true,</span>
                        <br />
                        <span className="indent">NodeJS:</span><span className="keyColor"> true,</span>
                        <br />
                        <span className="indent">SQL:</span><span className="keyColor"> true,</span>
                        <br />
                        <span className="indent">Git:</span><span className="keyColor"> true,</span>
                        <br />
                        <span className="indent">}</span>
                        <br />
                        <span>}</span>
                        <br />
                        </Typist>
                    </div>

                : ""}
                                





                {this.state.endLine ? 
                    <div className="code generic"  style={{color: this.state.color}}> 
                        <Typist onCharacterTyped={this.scroller.bind(this)} onTypingDone={this.nextCmd.bind(this)} cursor={{ hideWhenDone: true, hideWhenDoneDelay: 0, element: '_' }}>
                        <br />
                        <span style={{color: "white"}}>start contact.cmd</span>
                        </Typist>
                    </div>

                : ""}
                {this.state.newCmd ? 
                    <div className="code generic"  style={{color: this.state.color}}> 
                        <Typist onCharacterTyped={this.scroller.bind(this)} onTypingDone={this.projHolder.bind(this)} cursor={{ element: '_' }}>
                        <br />
                        <Typist.Delay ms={1500} /> 
                        <span>{prevProj}</span>
                        <br />
                        </Typist>
                    </div>
                    :""}
                </div>
                </div>
                </div>

             
            <div className="row mb-3 mt-5 ">
                        <div className="col-lg-6 col-md-12 col-sm-12 ml-auto projHolder" style={this.state.projHolder}>
                        <div className="row justify-content-center">

                        <div className="col-lg-4 col-md-12 mt-5 imgContain">
                        <img src="/img/crbn.png" className="image" alt="" />
                        <a href="https://crbnapp.herokuapp.com" target="_blank" rel="noopener noreferrer"> 
                        <div className="overlay">
                            <div className="text">
                            <p>CRBN</p>
                            <p>An app that gives a Carbon emissions score based on some lifestyle factors, and allows you to offset emissions through attending community events.</p>
                            <p>Built with HTML/CSS/NodeJS/Sequelize/Postgres/Express/React/AuthJS/ChartJS</p>
                        </div>
                        </div></a>
                        </div>

                        <div className="col-lg-4 col-md-12 mt-5 media imgContain">
                        <img src="/img/tagged.png" className="image" alt="" />
                        
                        <a href="https://taggedapp.herokuapp.com" target="_blank" rel="noopener noreferrer">
                        <div className="overlay">
                             <div className="text">
                            <p>Tagged</p>
                            <p>An app that gives your car an Inbox.  Messaging system using license plate numbers.</p>
                            <p>Built with HTML/CSS/NodeJS/Sequelize/Postgres/Express/AuthJS</p>
                        </div>
                        </div></a>
                        </div>

                        <div className="col-lg-4 col-md-12 mt-5 imgContain">
                        <img src="/img/cryptoPulse.png" className="image " alt="" />
                        <a href="https://eloquent-khorana-9548ca.netlify.com/index.html" target="_blank" rel="noopener noreferrer"> 
                        <div className="overlay">
                            <div className="text">
                            <p>CryptoPulse</p>
                            <p>A crypto charting application.</p>
                            <p>Built with HTML/CSS/JQuery/Ajax/ChartJS/Firebase</p>

                        </div>
                        </div></a>
                        </div>

                        </div>
                        </div>
                <div className="col-lg-5 col-md-12 mr-auto " id={this.state.aboutme}>
                
                <div className="console2" style={{opacity: this.state.newCmdVis}} >
                {this.state.nextCmd ?
                    <Typist onTypingDone={this.github.bind(this)} cursor={{ hideWhenDone: true, hideWhenDoneDelay: 0 }}>
                     <a href="https://github.com/cryptoads" target="_blank" rel="noopener noreferrer"><i className="fab fa-2x fa-github"></i> </a>
                     <a href="https://twitter.com/ellipticswerve" target="_blank" rel="noopener noreferrer"><i className="fab fa-2x fa-twitter-square"></i> </a>
                    <span onClick={this.showModal.bind(this)}><i className="fas fa-2x fa-user-astronaut"></i> </span>
                    </Typist>
                    : <div className="col-lg-5 col-md-12 mr-auto "><div className="console2" style={{opacity: 0}}></div></div>}


   
 


                </div>
                </div>


    </div> 

        <Modal show={this.state.show} handleClose={this.hideModal.bind(this)} >
          <img className="aboutMeImg" src="/img/meonbike.jpg" alt="" />

        <span className="aboutText mr-auto">Things I like:
            <br />
            <i className="aboutText fas fa-2x fa-hiking"> </i>
            <i className="aboutText fas fa-2x fa-campground"> </i> 
            <i className="aboutText fas fa-2x fa-bicycle"> </i> 
            <i className="aboutText fas fa-2x fa-camera-retro"> </i>
            <i className="aboutText fab fa-2x fa-d-and-d"> </i>
            <i className="aboutText fab fa-2x fa-bitcoin"> </i>
         
            <br />
            <span style={{color: this.state.color}}>Status:</span><span className="keyColor"> Employed</span>
        </span>
        </Modal>





    </div> 
    
        ) 
 }
}


const Modal = ({ handleClose, show, children }) => {
  const showHideClassName = show ? 'modal display-block' : 'modal display-none';

  return (
    <div className={showHideClassName}>
      <section className='modal-main'>
        {children}
        <button className="aboutClose" onClick={handleClose}>
          X
        </button>
      </section>
    </div>
  );
};

export default Console; 