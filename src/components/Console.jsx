import React, { Component } from 'react';

const COMMANDS = {
  help: [
    'Available commands:',
    '  whoami     print identity',
    '  status     show current signal',
    '  links      open external channels',
    '  clear      reset terminal'
  ],
  whoami: [
    'Chris Michels',
    'Builder. Operator. Systems-minded human.',
    'This node is intentionally minimal.'
  ],
  status: [
    'mode: low-noise',
    'focus: useful interfaces, sharp tooling, durable ideas',
    'signal: online'
  ],
  links: [
    'github:  https://github.com/cryptoads',
    'twitter: https://twitter.com/ellipticswerve'
  ]
};

class Console extends Component {
  constructor(props) {
    super(props);

    this.state = {
      history: [
        { type: 'system', text: 'CHRIS_MICHELS://terminal' },
        { type: 'system', text: 'interface loaded' },
        { type: 'system', text: 'type help and press enter' }
      ],
      input: ''
    };

    this.terminalRef = null;
  }

  componentDidUpdate() {
    if (this.terminalRef) {
      this.terminalRef.scrollTop = this.terminalRef.scrollHeight;
    }
  }

  setTerminalRef(element) {
    this.terminalRef = element;
  }

  handleInputChange(event) {
    this.setState({ input: event.target.value });
  }

  handleKeyDown(event) {
    if (event.key === 'Enter') {
      this.runCommand();
    }
  }

  runCommand() {
    const rawCommand = this.state.input.trim();
    const command = rawCommand.toLowerCase();

    if (!rawCommand) {
      return;
    }

    if (command === 'clear') {
      this.setState({
        history: [{ type: 'system', text: 'terminal cleared' }],
        input: ''
      });
      return;
    }

    const output = COMMANDS[command] || [
      'command not found: ' + rawCommand,
      'type help for available commands'
    ];

    this.setState({
      history: this.state.history.concat(
        { type: 'command', text: rawCommand },
        output.map(function(line) {
          return { type: 'output', text: line };
        })
      ),
      input: ''
    });
  }

  focusInput() {
    if (this.inputRef) {
      this.inputRef.focus();
    }
  }

  renderHistoryLine(line, index) {
    if (line.type === 'command') {
      return (
        <div className="terminal-line terminal-command" key={index}>
          <span className="prompt">chris@portfolio:~$</span>
          <span>{line.text}</span>
        </div>
      );
    }

    return (
      <div className={'terminal-line terminal-' + line.type} key={index}>
        {line.text || '\u00a0'}
      </div>
    );
  }

  render() {
    return (
      <main className="terminal-page">
        <section className="terminal-shell" onClick={this.focusInput.bind(this)}>
          <header className="terminal-header">
            <div className="terminal-controls" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span className="terminal-title">chris.michels</span>
            <span className="terminal-status">online</span>
          </header>

          <div className="terminal-body" ref={this.setTerminalRef.bind(this)}>
            {this.state.history.map(this.renderHistoryLine.bind(this))}

            <div className="terminal-line terminal-input-row">
              <label className="prompt" htmlFor="terminal-input">chris@portfolio:~$</label>
              <input
                id="terminal-input"
                ref={function(input) { this.inputRef = input; }.bind(this)}
                value={this.state.input}
                onChange={this.handleInputChange.bind(this)}
                onKeyDown={this.handleKeyDown.bind(this)}
                autoComplete="off"
                autoFocus
                spellCheck="false"
                aria-label="Terminal command"
              />
            </div>
          </div>
        </section>
      </main>
    );
  }
}

export default Console;
