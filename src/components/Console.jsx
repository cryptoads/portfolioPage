import React, { Component } from 'react';
import Typist from 'react-typist';


class Console extends Component {
    constructor(props){
    super(props)

    this.state= {
      showName: {opacity: 0},
      name: false,
      color: "white",
      codeColor: false,
      keyColor: false,
      keyClass: "generic",
      description: false,
      newCmd: false,
      fetch: false,
      newCmdVis: 0,
      jsonRes:false,
      location: false,
      skillJson: false,
      html: false,
      css: false,
      js: false,
      node: false,
      sql: false,
      git: false,
      react: false,
      brack: false,
      endLine: false,
    github: false,
      projHolder: {visibility: 'hidden', animation: 'fadein 1s linear', opacity: 0},
     
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

codingStart(){
    this.setState({codeColor : true})
}

scroller(){
    document.getElementById("MyDivElement").scrollTop = 9999999;
    
}

nextCmd(){
    this.setState({newCmd: true, newCmdVis: .8})
}

fetch(){
    this.setState({fetch:true})
}

jsonRes(){
    this.setState({jsonRes:true})
}
location(){
    this.setState({location:true})
}
skillJson(){
    this.setState({skillJson:true})
}
html(){
    this.setState({html:true})
}
css(){
    this.setState({css:true})
}
js(){
    this.setState({js:true})
}
node(){
    this.setState({node:true})
}
sql(){
    this.setState({sql:true})
}
react(){
    this.setState({react:true})
}
brack(){
    this.setState({brack:true})
}
git(){
    this.setState({git:true})
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




 render(){
    let thefetch= ".then(res()=>{res.json();})"
    let colorString = "{ color: #50d8ec; }";
    let keyValueString = "{ color: #f008b7; }"
    let bracket = "{"
    let prevProj = ".previousProjects { visibility: visible; }"

    return (

       <div className="container-fluid">
       <div className="row justify-content-between mb-5 toprow">
            <div className="col-lg-6 col-md-12 ml-auto">
                <h1 className="victory" style={this.state.showName}><code> Chris Michels</code></h1>
            </div>
            <div className="col-lg-5 col-md-12 mt-5 mr-auto ">
            <div className="console " id="MyDivElement">



            <Typist onTypingDone={this.showName.bind(this)}  stdTypingDelay={50} cursor={{ hideWhenDone: true, hideWhenDoneDelay: 0, element: '_' }}> 
              <span> HELLO </span>
              <br />
               <Typist.Delay ms={500} />
              <span>MY NAME IS CHRIS MICHELS</span> 
            </Typist>



                {this.state.name ? 
                    <div>
                    <Typist onTypingDone={this.codingStart.bind(this)} cursor={{ hideWhenDone: true, hideWhenDoneDelay: 100, element: '_' }}>
                        <Typist.Delay ms={1500} />LET'S TALK ABOUT ME, THAT'S WHY YOU ARE HERE, RIGHT?
                        <Typist.Delay ms={1500} />
                        <br/ >
                    </Typist> 
                    </div>
                    : 
                    ""}


                {this.state.codeColor ?
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
                        </Typist>
                        </div>
                 : ""}


                {this.state.description ?
                    <div className="code generic"  style={{color: this.state.color}}> 
                        <Typist onLineTyped={this.scroller.bind(this)} onTypingDone={this.fetch.bind(this)} cursor={{ hideWhenDone: true, hideWhenDoneDelay: 0, element: '_' }}>
                        <br />
                        <span>fetch('/aboutChris')</span> 
                        </Typist>
                    </div>
                :""}

                {this.state.fetch ? 
                    <div className="code generic"  style={{color: this.state.color}}> 
                        <Typist onLineTyped={this.scroller.bind(this)} onTypingDone={this.jsonRes.bind(this)} cursor={{ hideWhenDone: true, hideWhenDoneDelay: 0, element: '_' }}>
                        <span>{thefetch}</span> 
                        <br />
                        </Typist>
                    </div>
                : ""}    
                     
                {this.state.jsonRes ? 
                    <div className="code generic"  style={{color: this.state.color}}> 
                        <Typist onLineTyped={this.scroller.bind(this)} onTypingDone={this.location.bind(this)} cursor={{ hideWhenDone: true, hideWhenDoneDelay: 0, element: '_' }}>
                        <br />
                        <span>{bracket}description:</span><span className="keyColor"> 'Full Stack Developer',</span>
                        <br />
                        </Typist>
                    </div>

                : ""}
                {this.state.location ? 
                    <div className="code generic"  style={{color: this.state.color}}> 
                        <Typist onLineTyped={this.scroller.bind(this)} onTypingDone={this.skillJson.bind(this)} cursor={{ hideWhenDone: true, hideWhenDoneDelay: 0, element: '_' }}>
                        <span>location:</span><span className="keyColor"> 'Atlanta, GA',</span>
                        <br />
                        </Typist>
                    </div>

                : ""}

                {this.state.skillJson ? 
                    <div className="code generic"  style={{color: this.state.color}}> 
                        <Typist onLineTyped={this.scroller.bind(this)} onTypingDone={this.html.bind(this)} cursor={{ hideWhenDone: true, hideWhenDoneDelay: 0, element: '_' }}>
                        <span>skills:</span>
                        <br />
                        </Typist>
                    </div>

                : ""}

                {this.state.html ? 
                    <div className="code generic"  style={{color: this.state.color}}> 
                        <Typist onLineTyped={this.scroller.bind(this)} onTypingDone={this.css.bind(this)} cursor={{ hideWhenDone: true, hideWhenDoneDelay: 0, element: '_' }}>
                        <span className="indent">{bracket}HTML:</span><span className="keyColor"> true,</span>
                        <br />
                        </Typist>
                    </div>

                : ""}

                {this.state.css ? 
                    <div className="code generic"  style={{color: this.state.color}}> 
                        <Typist onLineTyped={this.scroller.bind(this)} onTypingDone={this.js.bind(this)} cursor={{ hideWhenDone: true, hideWhenDoneDelay: 0, element: '_' }}>
                        <span className="indent">CSS:</span><span className="keyColor"> true,</span>
                        <br />
                        </Typist>
                    </div>

                : ""}

                {this.state.js ? 
                    <div className="code generic"  style={{color: this.state.color}}> 
                        <Typist onLineTyped={this.scroller.bind(this)} onTypingDone={this.react.bind(this)} cursor={{ hideWhenDone: true, hideWhenDoneDelay: 0, element: '_' }}>
                        <span className="indent">JS:</span><span className="keyColor"> true,</span>
                        <br />
                        </Typist>
                    </div>

                : ""}
                                
                {this.state.react ? 
                    <div className="code generic"  style={{color: this.state.color}}> 
                        <Typist onLineTyped={this.scroller.bind(this)} onTypingDone={this.node.bind(this)} cursor={{ hideWhenDone: true, hideWhenDoneDelay: 0, element: '_' }}>
                        <span className="indent">React:</span><span className="keyColor"> true,</span>
                        <br />
                        </Typist>
                    </div>

                : ""}

                                {this.state.node ? 
                    <div className="code generic"  style={{color: this.state.color}}> 
                        <Typist onLineTyped={this.scroller.bind(this)} onTypingDone={this.sql.bind(this)} cursor={{ hideWhenDone: true, hideWhenDoneDelay: 0, element: '_' }}>
                        <span className="indent">NodeJS:</span><span className="keyColor"> true,</span>
                        <br />
                        </Typist>
                    </div>

                : ""}

                                {this.state.sql ? 
                    <div className="code generic"  style={{color: this.state.color}}> 
                        <Typist onLineTyped={this.scroller.bind(this)} onTypingDone={this.git.bind(this)} cursor={{ hideWhenDone: true, hideWhenDoneDelay: 0, element: '_' }}>
                        <span className="indent">SQL:</span><span className="keyColor"> true,</span>
                        <br />
                        </Typist>
                    </div>

                : ""}
                                {this.state.git ? 
                    <div className="code generic"  style={{color: this.state.color}}> 
                        <Typist onCharacterTyped={this.scroller.bind(this)} onTypingDone={this.brack.bind(this)} cursor={{ hideWhenDone: true, hideWhenDoneDelay: 0, element: '_' }}>
                        <span className="indent">Git:</span><span className="keyColor"> true,</span>
                        <br />
                        </Typist>
                    </div>

                : ""}
                                {this.state.brack ? 
                    <div className="code generic"  style={{color: this.state.color}}> 
                        <Typist onCharacterTyped={this.scroller.bind(this)} onTypingDone={this.endLine.bind(this)} cursor={{ hideWhenDone: true, hideWhenDoneDelay: 0, element: '_' }}>
                        <span className="indent">}</span>
                        <br />
                        </Typist>
                    </div>

                : ""}
                {this.state.endLine ? 
                    <div className="code generic"  style={{color: this.state.color}}> 
                        <Typist onCharacterTyped={this.scroller.bind(this)} onTypingDone={this.nextCmd.bind(this)} cursor={{ hideWhenDone: true, hideWhenDoneDelay: 0, element: '_' }}>
                        <span>}</span>
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

             
            <div className="row mb-3 mt-5 justify-content-between">
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
                        <img src="/img/tagged.png" className="image align-self-end" alt="" />
                        
                        <div className="overlay">
                           <a href="https://taggedapp.herokuapp.com" target="_blank" rel="noopener noreferrer">  <div className="text">
                            <p>Tagged</p>
                            <p>An app that gives your car an Inbox.  Messaging system using license plate numbers.</p>
                            <p>Built with HTML/CSS/NodeJS/Sequelize/Postgres/Express/AuthJS</p>
                        </div></a>
                        </div>
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
                <div className="col-lg-5 col-md-12 mr-auto " id="f1_container">
                <div id="f1_card">
                <div className="console2 face" style={{opacity: this.state.newCmdVis}} >
                {this.state.newCmd ?
                    <Typist onTypingDone={this.github.bind(this)} cursor={{ hideWhenDone: true, hideWhenDoneDelay: 0 }}>
                    My Github: <a href="https://github.com/cryptoads" target="_blank" rel="noopener noreferrer"><i className="fab fa-2x fa-github"></i> </a>
                    </Typist>

                    : <div className="col-lg-5 col-md-12 mr-auto "><div className="console2" style={{opacity: 0}}></div></div>}

 
                {this.state.github ?
                    <div >
                    <Typist>
                    My Twitter: <a href="https://twitter.com/CreekAddict" target="_blank" rel="noopener noreferrer"><i className="fab fa-2x fa-twitter-square"></i> </a>
                    </Typist>
                    </div>

                    : ""}
                 <div className="back"><p>this</p></div>   
                </div>
                </div>
                </div>


    </div>
    </div>
    
        )
 }
}

export default Console;