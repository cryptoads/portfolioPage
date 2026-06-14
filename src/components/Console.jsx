import React, { Component } from 'react';
import EC from 'elliptic/lib/elliptic/ec';
import hash from 'hash.js';

const ec = new EC('secp256k1');

const COMMANDS = {
  help: [
    'Available commands:',
    '  whoami     print identity',
    '  status     show current signal',
    '  contact    show contact channels',
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
    { label: 'github', href: 'https://github.com/cryptoads' },
    { label: 'twitter', href: 'https://twitter.com/ellipticswerve' }
  ],
  contact: [
    'open channels:',
    { label: 'github', href: 'https://github.com/cryptoads' },
    { label: 'twitter', href: 'https://twitter.com/ellipticswerve' }
  ]
};

const SIGNAL_COMMANDS = {
  help: [
    'signal commands:',
    '  scan    read ambient interface state',
    '  bitcoin generate demo bitcoin keys',
    '  clear   reset this shell',
    '  close   detach signal shell'
  ],
  scan: [
    'scan complete',
    'noise: low',
    'route: stable',
    'operator: present'
  ]
};

function bytesToHex(bytes) {
  return Array.prototype.map.call(bytes, function(byte) {
    return ('0' + byte.toString(16)).slice(-2);
  }).join('');
}

function hexToBytes(hex) {
  const bytes = [];

  for (let index = 0; index < hex.length; index += 2) {
    bytes.push(parseInt(hex.slice(index, index + 2), 16));
  }

  return bytes;
}

function sha256(bytes) {
  return hash.sha256().update(bytes).digest();
}

function base58Encode(bytes) {
  const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  const digits = [0];
  let zeroes = 0;

  while (zeroes < bytes.length && bytes[zeroes] === 0) {
    zeroes += 1;
  }

  for (let index = zeroes; index < bytes.length; index += 1) {
    let carry = bytes[index];

    for (let digitIndex = 0; digitIndex < digits.length; digitIndex += 1) {
      carry += digits[digitIndex] << 8;
      digits[digitIndex] = carry % 58;
      carry = Math.floor(carry / 58);
    }

    while (carry > 0) {
      digits.push(carry % 58);
      carry = Math.floor(carry / 58);
    }
  }

  let output = '';

  for (let index = 0; index < zeroes; index += 1) {
    output += alphabet[0];
  }

  for (let index = digits.length - 1; index >= 0; index -= 1) {
    output += alphabet[digits[index]];
  }

  return output;
}

function base58Check(payload) {
  const checksum = sha256(sha256(payload)).slice(0, 4);
  return base58Encode(payload.concat(checksum));
}

function generateBitcoinKeypair() {
  const privateBytes = new Uint8Array(32);
  let privateHex = '';
  let key = null;

  do {
    window.crypto.getRandomValues(privateBytes);
    privateHex = bytesToHex(privateBytes);
    key = ec.keyFromPrivate(privateHex, 'hex');
  } while (key.getPrivate().isZero() || key.getPrivate().cmp(ec.curve.n) >= 0);

  const publicHex = key.getPublic(true, 'hex');
  const publicHash = hash.ripemd160().update(sha256(hexToBytes(publicHex))).digest();
  const address = base58Check([0].concat(publicHash));
  const wif = base58Check([128].concat(hexToBytes(privateHex), [1]));

  return [
    {
      kind: 'bitcoin-warning',
      label: 'warning',
      value: 'demo browser-generated key. do not use for real funds.'
    },
    { kind: 'bitcoin-field', label: 'private hex', value: privateHex },
    { kind: 'bitcoin-field', label: 'private wif', value: wif },
    { kind: 'bitcoin-field', label: 'public key', value: publicHex },
    { kind: 'bitcoin-address', label: 'address', value: address }
  ];
}

function createMatrixColumns() {
  const chars = '0101011010010110ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*+-/<>';

  return Array.from({ length: 72 }).map(function(_, index) {
    return {
      text: Array.from({ length: 56 }).map(function() {
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(''),
      left: (index / 72) * 100,
      delay: Math.random() * 0.85,
      duration: 1.55 + Math.random() * 1.1,
      opacity: 0.35 + Math.random() * 0.65,
      size: 12 + Math.floor(Math.random() * 9)
    };
  });
}

function createScanOutput() {
  return [
    'scan complete',
    'noise: low',
    'route: stable',
    'operator: present',
    'ambient signal: clean'
  ];
}

function createLoaderBar(progress) {
  const width = 18;
  const filled = Math.round((progress / 100) * width);

  return '[' + Array.from({ length: width }).map(function(_, index) {
    return index < filled ? '#' : '.';
  }).join('') + '] ' + progress + '%';
}

function getMatrixGlyph() {
  const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*+-/<>';

  return chars[Math.floor(Math.random() * chars.length)];
}

function createMatrixColumnText(column) {
  return column.text.split('').map(function(char, index) {
    if (index === 0 || Math.random() > 0.78) {
      return getMatrixGlyph();
    }

    return char;
  }).join('');
}

function createMatrixRefresh(columns) {
  return columns.map(function(column) {
    return Object.assign({}, column, {
      text: createMatrixColumnText(column)
    });
  });
}

class Console extends Component {
  constructor(props) {
    super(props);

    this.state = {
      history: [
        { type: 'system', text: 'CHRIS_MICHELS://terminal' },
        { type: 'system', text: 'interface loaded' },
        { type: 'system', text: 'type help and press enter' }
      ],
      input: '',
      commandHistory: [],
      commandIndex: null,
      signalOpen: false,
      signalHistory: [
        { type: 'system', text: 'signal shell ready' },
        { type: 'system', text: 'type help' }
      ],
      signalInput: '',
      signalPosition: { x: 32, y: 32 },
      signalDragging: false,
      signalDragOffset: { x: 0, y: 0 },
      matrixActive: false,
      matrixColumns: []
    };

    this.terminalRef = null;
    this.signalBodyRef = null;
    this.signalInputRef = null;
    this.boundSignalDrag = this.handleSignalDrag.bind(this);
    this.boundStopSignalDrag = this.stopSignalDrag.bind(this);
    this.matrixTimeout = null;
    this.matrixInterval = null;
    this.scanInterval = null;
    this.scanTimeout = null;
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.boundSignalDrag);
    document.addEventListener('mouseup', this.boundStopSignalDrag);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.boundSignalDrag);
    document.removeEventListener('mouseup', this.boundStopSignalDrag);
    window.clearTimeout(this.matrixTimeout);
    window.clearInterval(this.matrixInterval);
    window.clearInterval(this.scanInterval);
    window.clearTimeout(this.scanTimeout);
  }

  componentDidUpdate() {
    if (this.terminalRef) {
      this.terminalRef.scrollTop = this.terminalRef.scrollHeight;
    }

    if (this.signalBodyRef) {
      this.signalBodyRef.scrollTop = this.signalBodyRef.scrollHeight;
    }
  }

  setTerminalRef(element) {
    this.terminalRef = element;
  }

  setSignalBodyRef(element) {
    this.signalBodyRef = element;
  }

  handleInputChange(event) {
    this.setState({ input: event.target.value });
  }

  handleKeyDown(event) {
    const key = event.key || event.keyCode;

    if (key === 'Enter' || key === 13) {
      this.runCommand();
    } else if (key === 'ArrowUp' || key === 'Up' || key === 38) {
      event.preventDefault();
      this.showPreviousCommand();
    } else if (key === 'ArrowDown' || key === 'Down' || key === 40) {
      event.preventDefault();
      this.showNextCommand();
    }
  }

  showPreviousCommand() {
    const commands = this.state.commandHistory;

    if (!commands.length) {
      return;
    }

    const currentIndex = this.state.commandIndex === null
      ? commands.length
      : this.state.commandIndex;
    const nextIndex = Math.max(currentIndex - 1, 0);

    this.setState({
      commandIndex: nextIndex,
      input: commands[nextIndex]
    });
  }

  showNextCommand() {
    const commands = this.state.commandHistory;

    if (!commands.length || this.state.commandIndex === null) {
      return;
    }

    const nextIndex = this.state.commandIndex + 1;

    if (nextIndex >= commands.length) {
      this.setState({
        commandIndex: null,
        input: ''
      });
      return;
    }

    this.setState({
      commandIndex: nextIndex,
      input: commands[nextIndex]
    });
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
        input: '',
        commandHistory: this.state.commandHistory.concat(rawCommand),
        commandIndex: null
      });
      return;
    }

    if (command === 'signal') {
      this.setState({
        history: this.state.history.concat(
          { type: 'command', text: rawCommand },
          { type: 'output', text: 'signal shell attached' }
        ),
        input: '',
        commandHistory: this.state.commandHistory.concat(rawCommand),
        commandIndex: null,
        signalOpen: true
      });
      return;
    }

    if (command === 'matrix') {
      this.startMatrixSequence(rawCommand);
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
      input: '',
      commandHistory: this.state.commandHistory.concat(rawCommand),
      commandIndex: null
    });
  }

  focusInput() {
    if (this.inputRef) {
      this.inputRef.focus();
    }
  }

  focusSignalInput() {
    if (this.signalInputRef) {
      this.signalInputRef.focus();
    }
  }

  handleSignalInputChange(event) {
    this.setState({ signalInput: event.target.value });
  }

  handleSignalKeyDown(event) {
    const key = event.key || event.keyCode;

    if (key === 'Enter' || key === 13) {
      this.runSignalCommand();
    }
  }

  runSignalCommand() {
    const rawCommand = this.state.signalInput.trim();
    const command = rawCommand.toLowerCase();

    if (!rawCommand) {
      return;
    }

    if (command === 'close') {
      this.setState({
        signalOpen: false,
        signalInput: ''
      });
      return;
    }

    if (command === 'clear') {
      window.clearInterval(this.scanInterval);
      window.clearTimeout(this.scanTimeout);
      this.setState({
        signalHistory: [{ type: 'system', text: 'signal shell cleared' }],
        signalInput: ''
      });
      return;
    }

    if (command === 'scan') {
      this.runSignalScan(rawCommand);
      return;
    }

    if (command === 'bitcoin') {
      this.setState({
        signalHistory: this.state.signalHistory.concat(
          { type: 'command', text: rawCommand },
          generateBitcoinKeypair().map(function(line) {
            return { type: 'output', text: line };
          })
        ),
        signalInput: ''
      });
      return;
    }

    const output = SIGNAL_COMMANDS[command] || [
      'signal command not found: ' + rawCommand,
      'type help'
    ];

    this.setState({
      signalHistory: this.state.signalHistory.concat(
        { type: 'command', text: rawCommand },
        output.map(function(line) {
          return { type: 'output', text: line };
        })
      ),
      signalInput: ''
    });
  }

  runSignalScan(rawCommand) {
    window.clearInterval(this.scanInterval);
    window.clearTimeout(this.scanTimeout);

    this.setState({
      signalHistory: this.state.signalHistory.concat(
        { type: 'command', text: rawCommand },
        { type: 'loader', text: { label: 'scanning signal field', progress: 0 } }
      ),
      signalInput: ''
    }, function() {
      this.scanInterval = window.setInterval(function() {
        this.setState({
          signalHistory: this.state.signalHistory.map(function(line) {
            if (line.type !== 'loader') {
              return line;
            }

            return {
              type: 'loader',
              text: {
                label: line.text.label,
                progress: Math.min(line.text.progress + 10, 100)
              }
            };
          })
        });
      }.bind(this), 150);

      this.scanTimeout = window.setTimeout(function() {
        window.clearInterval(this.scanInterval);
        this.setState({
          signalHistory: this.state.signalHistory.reduce(function(lines, line) {
            if (line.type === 'loader') {
              return lines.concat(createScanOutput().map(function(outputLine) {
                return { type: 'output', text: outputLine };
              }));
            }

            return lines.concat(line);
          }, [])
        });
      }.bind(this), 1500);
    }.bind(this));
  }

  startSignalDrag(event) {
    const targetTag = event.target.tagName.toLowerCase();

    if (targetTag === 'button') {
      return;
    }

    this.setState({
      signalDragging: true,
      signalDragOffset: {
        x: event.clientX - this.state.signalPosition.x,
        y: event.clientY - this.state.signalPosition.y
      }
    });
  }

  handleSignalDrag(event) {
    if (!this.state.signalDragging) {
      return;
    }

    this.setState({
      signalPosition: {
        x: event.clientX - this.state.signalDragOffset.x,
        y: event.clientY - this.state.signalDragOffset.y
      }
    });
  }

  stopSignalDrag() {
    if (this.state.signalDragging) {
      this.setState({ signalDragging: false });
    }
  }

  closeSignalWindow() {
    this.setState({ signalOpen: false });
  }

  startMatrixSequence(rawCommand) {
    window.clearTimeout(this.matrixTimeout);
    window.clearInterval(this.matrixInterval);

    const columns = createMatrixColumns();

    this.matrixInterval = window.setInterval(function() {
      this.setState({
        matrixColumns: createMatrixRefresh(this.state.matrixColumns)
      });
    }.bind(this), 120);

    this.matrixTimeout = window.setTimeout(function() {
      window.clearInterval(this.matrixInterval);
      this.setState({ matrixActive: false });
    }.bind(this), 2400);

    this.setState({
      history: this.state.history.concat(
        { type: 'command', text: rawCommand },
        { type: 'output', text: 'matrix rain initialized' }
      ),
      input: '',
      commandHistory: this.state.commandHistory.concat(rawCommand),
      commandIndex: null,
      matrixActive: true,
      matrixColumns: columns
    });
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

    if (typeof line.text === 'object') {
      return (
        <div className={'terminal-line terminal-' + line.type} key={index}>
          <a href={line.text.href} target="_blank" rel="noopener noreferrer">
            {line.text.label}: {line.text.href}
          </a>
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
        {this.state.signalOpen ? (
          <aside
            className="signal-window"
            onClick={this.focusSignalInput.bind(this)}
            style={{
              transform: 'translate(' + this.state.signalPosition.x + 'px, ' + this.state.signalPosition.y + 'px)'
            }}
          >
            <header className="signal-header" onMouseDown={this.startSignalDrag.bind(this)}>
              <span>signal.shell</span>
              <button type="button" onClick={this.closeSignalWindow.bind(this)} aria-label="Close signal shell">
                x
              </button>
            </header>
            <div className="signal-body" ref={this.setSignalBodyRef.bind(this)}>
              {this.state.signalHistory.map(function(line, index) {
                if (line.type === 'loader') {
                  return (
                    <div className="signal-line signal-loader" key={index}>
                      <span>{line.text.label}</span>
                      <span>{createLoaderBar(line.text.progress)}</span>
                    </div>
                  );
                }

                if (typeof line.text === 'object') {
                  return (
                    <div className={'signal-line signal-' + line.text.kind} key={index}>
                      <span className="signal-label">{line.text.label}</span>
                      <span className="signal-value">{line.text.value}</span>
                    </div>
                  );
                }

                return (
                  <div className={'signal-line signal-' + line.type} key={index}>
                    {line.type === 'command' ? 'sig> ' : ''}{line.text || '\u00a0'}
                  </div>
                );
              })}
              <div className="signal-line signal-input-row">
                <label htmlFor="signal-input">sig&gt;</label>
                <input
                  id="signal-input"
                  ref={function(input) { this.signalInputRef = input; }.bind(this)}
                  value={this.state.signalInput}
                  onChange={this.handleSignalInputChange.bind(this)}
                  onKeyDown={this.handleSignalKeyDown.bind(this)}
                  autoComplete="off"
                  spellCheck="false"
                  aria-label="Signal command"
                />
              </div>
            </div>
          </aside>
        ) : ''}
        {this.state.matrixActive ? (
          <div className="matrix-rain" aria-hidden="true">
            {this.state.matrixColumns.map(function(column, index) {
              return (
                <span
                  key={index}
                  style={{
                    animationDelay: column.delay + 's',
                    animationDuration: column.duration + 's',
                    fontSize: column.size + 'px',
                    left: column.left + '%',
                    opacity: column.opacity
                  }}
                >
                  {column.text}
                </span>
              );
            })}
          </div>
        ) : ''}
      </main>
    );
  }
}

export default Console;
