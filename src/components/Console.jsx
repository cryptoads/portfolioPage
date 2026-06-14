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
    '  mud        jack into a local text-world',
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
  ]
};

const MUD_ROOMS = {
  threshold: {
    title: 'Threshold Station',
    description: [
      'You stand in an abandoned metro station under a city that forgot its own name.',
      'Black rain slides down tiled walls. A turnstile hums with standby power.',
      'A cracked directory blinks: THE ARCHIVE IS BELOW THE CITY.'
    ],
    exits: { north: 'relay', east: 'clinic', west: 'market' },
    terminal: {
      name: 'turnstile',
      prompt: 'The turnstile asks for the mode printed by the surface terminal.',
      answer: 'low-noise',
      success: 'The gate rotates once. A brass token drops into your palm.',
      flag: 'turnstileOpen',
      item: 'brass token'
    }
  },
  relay: {
    title: 'Neon Relay',
    description: [
      'A forest of antennae sprouts from the tunnel roof.',
      'Each mast whispers a different version of your footsteps.',
      'A relay console waits under a sticker that says: REPEAT ONLY WHAT MATTERS.'
    ],
    exits: { south: 'threshold', east: 'chapel', down: 'switchyard' },
    terminal: {
      name: 'relay',
      prompt: 'The relay requests the word hidden in the clinic mnemonic.',
      answer: 'memory',
      success: 'The relay syncs. A packet called MEMORY.KEY lands in your cache.',
      flag: 'relaySynced',
      item: 'memory key'
    }
  },
  clinic: {
    title: 'Blue Clinic',
    description: [
      'Surgical lamps hang over empty chairs. The walls are papered with sleep-study graphs.',
      'A diagnostic screen loops one sentence: THE CITY HEALS BY REMEMBERING.',
      'A drawer is half-open beneath the monitor.'
    ],
    exits: { west: 'threshold', north: 'chapel' },
    item: 'glass prism',
    clue: 'A note in the drawer reads: memory is the password the relay will accept.'
  },
  market: {
    title: 'Ghost Market',
    description: [
      'Stalls made of dead laptops line the platform. Their screens show prices in extinct currencies.',
      'A vendor mannequin points toward a vending machine full of unlabeled cassette tapes.',
      'Something bright is wedged under the machine.'
    ],
    exits: { east: 'threshold', north: 'observatory' },
    item: 'cassette shard',
    clue: 'The cassette label reads: when the sky goes dark, look for dawn.'
  },
  chapel: {
    title: 'Data Chapel',
    description: [
      'Server racks stand like pews. Fiber optic candles pulse in violet and blue.',
      'An altar terminal is built from a laptop, a radio, and an old answering machine.',
      'The answering machine plays one message: bring memory to the silent choir.'
    ],
    exits: { south: 'clinic', west: 'relay', north: 'archive' },
    terminal: {
      name: 'altar',
      prompt: 'The altar asks what the city heals by.',
      answer: 'memory',
      success: 'The choir boots without sound. It gives you a choir cipher.',
      flag: 'choirAwake',
      item: 'choir cipher'
    }
  },
  switchyard: {
    title: 'Switchyard',
    description: [
      'Buried routers blink in rows under the platform.',
      'A red fiber line runs toward a locked core door.',
      'A maintenance placard says: TWO KEYS BEFORE ROOT.'
    ],
    exits: { up: 'relay', east: 'core' },
    locked: function(flags) {
      return !flags.relaySynced || !flags.choirAwake;
    },
    lockedText: 'The core door rejects you. It wants MEMORY.KEY and the choir cipher.'
  },
  observatory: {
    title: 'Subway Observatory',
    description: [
      'The ceiling has collapsed into a perfect circle of night.',
      'A telescope is aimed at a billboard reflected in rainwater.',
      'The lens housing has a prism-shaped slot.'
    ],
    exits: { south: 'market', east: 'archive' },
    use: {
      item: 'glass prism',
      success: [
        'The prism splits billboard glare into a word written in pale green: DAWN.',
        'The telescope prints a star token.'
      ],
      flag: 'starRead',
      reward: 'star token'
    }
  },
  archive: {
    title: 'Ash Archive',
    description: [
      'Rows of filing cabinets descend farther than the room should allow.',
      'Every drawer is labeled with a year that has not happened yet.',
      'A librarian process flickers on a dusty terminal.'
    ],
    exits: { south: 'chapel', west: 'observatory', down: 'vault' },
    terminal: {
      name: 'librarian',
      prompt: 'The librarian asks for the word seen through split light.',
      answer: 'dawn',
      success: 'A drawer opens. Inside is a root sigil, warm as a living thing.',
      flag: 'rootSigil',
      item: 'root sigil'
    }
  },
  core: {
    title: 'Cold Core',
    description: [
      'This room is a cube of black glass. Your reflection arrives half a second late.',
      'A root console floats in the center, cabled into nothing.',
      'It displays: SECRET KNOWLEDGE REQUIRES ATTENTION.'
    ],
    exits: { west: 'switchyard', down: 'vault' },
    terminal: {
      name: 'root',
      prompt: 'The root console asks what secret knowledge requires.',
      answer: 'attention',
      success: 'The console accepts you as temporary weather.',
      flag: 'rootOpen',
      item: 'root access'
    }
  },
  vault: {
    title: 'Black Vault',
    description: [
      'The vault is quiet enough to hear pixels cooling.',
      'A final terminal waits under a glass hood.',
      'It will open only for someone carrying root access, a star token, and a brass token.'
    ],
    exits: { up: 'archive', north: 'core' },
    final: true
  }
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
    { kind: 'bitcoin-warning', label: 'warning', value: 'demo browser-generated key. do not use for real funds.' },
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

function createMatrixRefresh(columns) {
  return columns.map(function(column) {
    return Object.assign({}, column, {
      text: column.text.split('').map(function(char, index) {
        return index === 0 || Math.random() > 0.78 ? getMatrixGlyph() : char;
      }).join('')
    });
  });
}

function outputLines(lines) {
  return lines.map(function(line) {
    return { type: 'output', text: line };
  });
}

function createAlias() {
  const names = ['ghost', 'cipher', 'neon', 'zero', 'relay', 'static', 'echo'];
  return names[Math.floor(Math.random() * names.length)] + '-' + Math.floor(100 + Math.random() * 900);
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
      matrixColumns: [],
      mudOpen: false,
      mudRoom: 'threshold',
      mudHistory: [],
      mudInput: '',
      mudInventory: [],
      mudFlags: {},
      mudHackTarget: null,
      mudWon: false,
      mudPosition: { x: 48, y: 74 },
      mudDragging: false,
      mudDragOffset: { x: 0, y: 0 },
      linkOpen: false,
      linkAlias: createAlias(),
      linkRoom: 'black-vault',
      linkMessages: [],
      linkInput: '',
      linkPosition: { x: 720, y: 120 },
      linkDragging: false,
      linkDragOffset: { x: 0, y: 0 }
    };

    this.terminalRef = null;
    this.signalBodyRef = null;
    this.signalInputRef = null;
    this.mudBodyRef = null;
    this.mudInputRef = null;
    this.linkBodyRef = null;
    this.linkInputRef = null;
    this.shouldScrollTerminal = true;
    this.shouldScrollSignal = true;
    this.shouldScrollMud = true;
    this.shouldScrollLink = true;
    this.boundSignalDrag = this.handleSignalDrag.bind(this);
    this.boundStopSignalDrag = this.stopSignalDrag.bind(this);
    this.boundMudDrag = this.handleMudDrag.bind(this);
    this.boundStopMudDrag = this.stopMudDrag.bind(this);
    this.boundLinkDrag = this.handleLinkDrag.bind(this);
    this.boundStopLinkDrag = this.stopLinkDrag.bind(this);
    this.matrixTimeout = null;
    this.matrixInterval = null;
    this.scanInterval = null;
    this.scanTimeout = null;
    this.linkInterval = null;
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.boundSignalDrag);
    document.addEventListener('mouseup', this.boundStopSignalDrag);
    document.addEventListener('mousemove', this.boundMudDrag);
    document.addEventListener('mouseup', this.boundStopMudDrag);
    document.addEventListener('mousemove', this.boundLinkDrag);
    document.addEventListener('mouseup', this.boundStopLinkDrag);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.boundSignalDrag);
    document.removeEventListener('mouseup', this.boundStopSignalDrag);
    document.removeEventListener('mousemove', this.boundMudDrag);
    document.removeEventListener('mouseup', this.boundStopMudDrag);
    document.removeEventListener('mousemove', this.boundLinkDrag);
    document.removeEventListener('mouseup', this.boundStopLinkDrag);
    window.clearTimeout(this.matrixTimeout);
    window.clearInterval(this.matrixInterval);
    window.clearInterval(this.scanInterval);
    window.clearTimeout(this.scanTimeout);
    window.clearInterval(this.linkInterval);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.terminalRef && this.shouldScrollTerminal) {
      this.terminalRef.scrollTop = this.terminalRef.scrollHeight;
      this.shouldScrollTerminal = false;
    }

    if (this.signalBodyRef && this.shouldScrollSignal) {
      this.signalBodyRef.scrollTop = this.signalBodyRef.scrollHeight;
      this.shouldScrollSignal = false;
    }

    if (this.mudBodyRef && this.shouldScrollMud) {
      this.mudBodyRef.scrollTop = this.mudBodyRef.scrollHeight;
      this.shouldScrollMud = false;
    }

    if (this.linkBodyRef && this.shouldScrollLink) {
      this.linkBodyRef.scrollTop = this.linkBodyRef.scrollHeight;
      this.shouldScrollLink = false;
    }

    if (!prevState.linkOpen && this.state.linkOpen) {
      this.fetchLinkMessages();
      this.linkInterval = window.setInterval(this.fetchLinkMessages.bind(this), 2200);
    }

    if (prevState.linkOpen && !this.state.linkOpen) {
      window.clearInterval(this.linkInterval);
    }
  }

  setTerminalRef(element) {
    this.terminalRef = element;
  }

  setSignalBodyRef(element) {
    this.signalBodyRef = element;
  }

  setMudBodyRef(element) {
    this.mudBodyRef = element;
  }

  setLinkBodyRef(element) {
    this.linkBodyRef = element;
  }

  isNearBottom(element) {
    if (!element) {
      return true;
    }

    return element.scrollHeight - element.scrollTop - element.clientHeight < 36;
  }

  handleMudScroll() {
    this.shouldScrollMud = this.isNearBottom(this.mudBodyRef);
  }

  handleLinkScroll() {
    this.shouldScrollLink = this.isNearBottom(this.linkBodyRef);
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

    const currentIndex = this.state.commandIndex === null ? commands.length : this.state.commandIndex;
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
      this.setState({ commandIndex: null, input: '' });
      return;
    }

    this.setState({ commandIndex: nextIndex, input: commands[nextIndex] });
  }

  runCommand() {
    const rawCommand = this.state.input.trim();
    const command = rawCommand.toLowerCase();

    if (!rawCommand) {
      return;
    }

    this.shouldScrollTerminal = true;

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

    if (command === 'mud') {
      this.openMud(rawCommand);
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
        outputLines(output)
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

  focusMudInput() {
    if (this.mudInputRef) {
      this.mudInputRef.focus();
    }
  }

  focusLinkInput() {
    if (this.linkInputRef) {
      this.linkInputRef.focus();
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

    this.shouldScrollSignal = true;

    if (command === 'close') {
      this.setState({ signalOpen: false, signalInput: '' });
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
        outputLines(output)
      ),
      signalInput: ''
    });
  }

  runSignalScan(rawCommand) {
    window.clearInterval(this.scanInterval);
    window.clearTimeout(this.scanTimeout);
    this.shouldScrollSignal = true;

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
              return lines.concat(outputLines(createScanOutput()));
            }

            return lines.concat(line);
          }, [])
        });
      }.bind(this), 1500);
    }.bind(this));
  }

  openMud(rawCommand) {
    this.setState({
      history: this.state.history.concat(
        { type: 'command', text: rawCommand },
        { type: 'output', text: 'mud process attached: /black-vault' }
      ),
      input: '',
      commandHistory: this.state.commandHistory.concat(rawCommand),
      commandIndex: null,
      mudOpen: true,
      mudHistory: [
        { type: 'system', text: 'BLACK VAULT MUD' },
        { type: 'system', text: 'goal: unlock the secret knowledge under the city' },
        { type: 'system', text: 'type help, then look' }
      ].concat(this.describeRoom('threshold'))
    });
  }

  describeRoom(roomKey) {
    const room = MUD_ROOMS[roomKey];
    const exits = Object.keys(room.exits || {}).join(', ');
    let lines = [
      { type: 'room', text: room.title },
      { type: 'output', text: room.description.join(' ') },
      { type: 'output', text: 'exits: ' + exits }
    ];

    if (room.item && this.state.mudInventory.indexOf(room.item) === -1 && !this.state.mudFlags['took:' + room.item]) {
      lines = lines.concat({ type: 'output', text: 'you see: ' + room.item });
    }

    if (room.terminal && !this.state.mudFlags[room.terminal.flag]) {
      lines = lines.concat({ type: 'output', text: 'terminal: ' + room.terminal.name });
    }

    if (room.final && !this.state.mudWon) {
      lines = lines.concat({ type: 'output', text: 'final task: unlock secret knowledge' });
    }

    return lines;
  }

  handleMudInputChange(event) {
    this.setState({ mudInput: event.target.value });
  }

  handleMudKeyDown(event) {
    const key = event.key || event.keyCode;

    if (key === 'Enter' || key === 13) {
      this.runMudCommand();
    }
  }

  appendMud(rawCommand, lines) {
    this.setState({
      mudHistory: this.state.mudHistory.concat(
        { type: 'command', text: rawCommand },
        lines.map(function(line) {
          return typeof line === 'string' ? { type: 'output', text: line } : line;
        })
      ),
      mudInput: ''
    });
  }

  runMudCommand() {
    const rawCommand = this.state.mudInput.trim();
    const command = rawCommand.toLowerCase();
    const parts = command.split(' ');
    const verb = parts[0];
    const rest = parts.slice(1).join(' ');
    const room = MUD_ROOMS[this.state.mudRoom];

    if (!rawCommand) {
      return;
    }

    this.shouldScrollMud = true;

    if (verb === 'quit' || verb === 'jack-out') {
      this.setState({ mudOpen: false, mudInput: '' });
      return;
    }

    if (verb === 'help') {
      this.appendMud(rawCommand, [
        'commands: look, go <exit>, north/east/south/west/up/down, take <item>, inventory',
        'commands: jack <terminal>, hack <answer>, use <item>, link, quit'
      ]);
      return;
    }

    if (verb === 'look') {
      this.appendMud(rawCommand, this.describeRoom(this.state.mudRoom));
      return;
    }

    if (verb === 'inventory' || verb === 'inv') {
      this.appendMud(rawCommand, [
        this.state.mudInventory.length ? 'inventory: ' + this.state.mudInventory.join(', ') : 'inventory: empty'
      ]);
      return;
    }

    if (verb === 'link') {
      this.setState({
        linkOpen: true,
        mudInput: '',
        mudHistory: this.state.mudHistory.concat(
          { type: 'command', text: rawCommand },
          { type: 'output', text: 'link channel opened. coordinate with another operator.' }
        )
      });
      return;
    }

    if (verb === 'go' || room.exits[verb]) {
      const direction = verb === 'go' ? rest : verb;
      const nextRoom = room.exits[direction];

      if (!nextRoom) {
        this.appendMud(rawCommand, ['no exit that way']);
        return;
      }

      const target = MUD_ROOMS[nextRoom];

      if (target.locked && target.locked(this.state.mudFlags)) {
        this.appendMud(rawCommand, [target.lockedText]);
        return;
      }

      this.setState({
        mudRoom: nextRoom,
        mudInput: '',
        mudHackTarget: null,
        mudHistory: this.state.mudHistory.concat(
          { type: 'command', text: rawCommand },
          this.describeRoom(nextRoom)
        )
      });
      return;
    }

    if (verb === 'take') {
      if (!room.item || rest !== room.item) {
        this.appendMud(rawCommand, ['nothing by that name is loose here']);
        return;
      }

      if (this.state.mudInventory.indexOf(room.item) !== -1 || this.state.mudFlags['took:' + room.item]) {
        this.appendMud(rawCommand, ['already taken']);
        return;
      }

      const flags = Object.assign({}, this.state.mudFlags);
      flags['took:' + room.item] = true;
      this.setState({
        mudInventory: this.state.mudInventory.concat(room.item),
        mudFlags: flags,
        mudInput: '',
        mudHistory: this.state.mudHistory.concat(
          { type: 'command', text: rawCommand },
          { type: 'output', text: 'taken: ' + room.item },
          room.clue ? { type: 'output', text: room.clue } : { type: 'output', text: 'it hums softly in your hand' }
        )
      });
      return;
    }

    if (verb === 'use') {
      if (!room.use || rest !== room.use.item) {
        this.appendMud(rawCommand, ['that does not fit here']);
        return;
      }

      if (this.state.mudInventory.indexOf(room.use.item) === -1) {
        this.appendMud(rawCommand, ['you do not have ' + room.use.item]);
        return;
      }

      const useFlags = Object.assign({}, this.state.mudFlags);
      useFlags[room.use.flag] = true;
      const useInventory = this.state.mudInventory.indexOf(room.use.reward) === -1
        ? this.state.mudInventory.concat(room.use.reward)
        : this.state.mudInventory;

      this.setState({
        mudFlags: useFlags,
        mudInventory: useInventory,
        mudInput: '',
        mudHistory: this.state.mudHistory.concat(
          { type: 'command', text: rawCommand },
          outputLines(room.use.success)
        )
      });
      return;
    }

    if (verb === 'jack') {
      if (!room.terminal || rest !== room.terminal.name) {
        this.appendMud(rawCommand, ['no compatible terminal by that name']);
        return;
      }

      if (this.state.mudFlags[room.terminal.flag]) {
        this.appendMud(rawCommand, ['terminal already solved']);
        return;
      }

      this.setState({
        mudHackTarget: this.state.mudRoom,
        mudInput: '',
        mudHistory: this.state.mudHistory.concat(
          { type: 'command', text: rawCommand },
          { type: 'output', text: room.terminal.prompt },
          { type: 'output', text: 'submit with: hack <answer>' }
        )
      });
      return;
    }

    if (verb === 'hack') {
      this.solveMudHack(rawCommand, rest);
      return;
    }

    if (verb === 'unlock' && room.final) {
      this.unlockVault(rawCommand, rest);
      return;
    }

    this.appendMud(rawCommand, ['unknown mud command. type help']);
  }

  solveMudHack(rawCommand, answer) {
    if (!this.state.mudHackTarget) {
      this.appendMud(rawCommand, ['no active jack. use jack <terminal> first']);
      return;
    }

    const room = MUD_ROOMS[this.state.mudHackTarget];
    const terminal = room.terminal;

    if (answer !== terminal.answer) {
      this.appendMud(rawCommand, ['access denied. the terminal goes cold for one breath.']);
      return;
    }

    const flags = Object.assign({}, this.state.mudFlags);
    flags[terminal.flag] = true;
    const inventory = this.state.mudInventory.indexOf(terminal.item) === -1
      ? this.state.mudInventory.concat(terminal.item)
      : this.state.mudInventory;

    this.setState({
      mudFlags: flags,
      mudInventory: inventory,
      mudHackTarget: null,
      mudInput: '',
      mudHistory: this.state.mudHistory.concat(
        { type: 'command', text: rawCommand },
        { type: 'output', text: terminal.success },
        { type: 'output', text: 'received: ' + terminal.item }
      )
    });
  }

  unlockVault(rawCommand, answer) {
    const needed = ['root access', 'star token', 'brass token'];
    const hasItems = needed.every(function(item) {
      return this.state.mudInventory.indexOf(item) !== -1;
    }.bind(this));

    if (!hasItems) {
      this.appendMud(rawCommand, ['the vault refuses you. it wants root access, a star token, and a brass token.']);
      return;
    }

    if (answer !== 'attention') {
      this.appendMud(rawCommand, ['the vault asks for the final word: what does secret knowledge require?']);
      return;
    }

    this.setState({
      mudWon: true,
      mudInput: '',
      mudHistory: this.state.mudHistory.concat(
        { type: 'command', text: rawCommand },
        { type: 'win', text: 'SECRET KNOWLEDGE UNLOCKED' },
        { type: 'win', text: 'Attention is the last private room. Guard it. Spend it like a key.' },
        { type: 'output', text: 'You beat Black Vault. The city keeps humming, but it knows your name now.' }
      )
    });
  }

  handleLinkInputChange(event) {
    this.setState({ linkInput: event.target.value });
  }

  handleLinkKeyDown(event) {
    const key = event.key || event.keyCode;

    if (key === 'Enter' || key === 13) {
      this.sendLinkMessage();
    }
  }

  fetchLinkMessages() {
    this.shouldScrollLink = this.isNearBottom(this.linkBodyRef);

    fetch('/api/link?room=' + encodeURIComponent(this.state.linkRoom))
      .then(function(response) {
        return response.json();
      })
      .then(function(payload) {
        this.setState({ linkMessages: payload.messages || [] });
      }.bind(this))
      .catch(function() {});
  }

  sendLinkMessage() {
    const text = this.state.linkInput.trim();

    if (!text) {
      return;
    }

    this.shouldScrollLink = true;

    fetch('/api/link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        room: this.state.linkRoom,
        alias: this.state.linkAlias,
        text: text
      })
    })
      .then(function(response) {
        return response.json();
      })
      .then(function(payload) {
        this.setState({
          linkMessages: payload.messages || [],
          linkInput: ''
        });
      }.bind(this))
      .catch(function() {
        this.setState({
          linkMessages: this.state.linkMessages.concat({
            alias: 'system',
            text: 'link unavailable'
          }),
          linkInput: ''
        });
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

  startMudDrag(event) {
    const targetTag = event.target.tagName.toLowerCase();

    if (targetTag === 'button') {
      return;
    }

    this.setState({
      mudDragging: true,
      mudDragOffset: {
        x: event.clientX - this.state.mudPosition.x,
        y: event.clientY - this.state.mudPosition.y
      }
    });
  }

  handleMudDrag(event) {
    if (!this.state.mudDragging) {
      return;
    }

    this.setState({
      mudPosition: {
        x: event.clientX - this.state.mudDragOffset.x,
        y: event.clientY - this.state.mudDragOffset.y
      }
    });
  }

  stopMudDrag() {
    if (this.state.mudDragging) {
      this.setState({ mudDragging: false });
    }
  }

  startLinkDrag(event) {
    const targetTag = event.target.tagName.toLowerCase();

    if (targetTag === 'button') {
      return;
    }

    this.setState({
      linkDragging: true,
      linkDragOffset: {
        x: event.clientX - this.state.linkPosition.x,
        y: event.clientY - this.state.linkPosition.y
      }
    });
  }

  handleLinkDrag(event) {
    if (!this.state.linkDragging) {
      return;
    }

    this.setState({
      linkPosition: {
        x: event.clientX - this.state.linkDragOffset.x,
        y: event.clientY - this.state.linkDragOffset.y
      }
    });
  }

  stopLinkDrag() {
    if (this.state.linkDragging) {
      this.setState({ linkDragging: false });
    }
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

  renderMudLine(line, index) {
    return (
      <div className={'mud-line mud-' + line.type} key={index}>
        {line.type === 'command' ? 'mud> ' : ''}{line.text || '\u00a0'}
      </div>
    );
  }

  renderSignalLine(line, index) {
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

        {this.state.mudOpen ? (
          <aside
            className="mud-window"
            onClick={this.focusMudInput.bind(this)}
            style={{ transform: 'translate(' + this.state.mudPosition.x + 'px, ' + this.state.mudPosition.y + 'px)' }}
          >
            <header className="mud-header" onMouseDown={this.startMudDrag.bind(this)}>
              <span>black-vault.mud</span>
              <button type="button" onClick={function() { this.setState({ mudOpen: false }); }.bind(this)}>x</button>
            </header>
            <div className="mud-body" ref={this.setMudBodyRef.bind(this)} onScroll={this.handleMudScroll.bind(this)}>
              {this.state.mudHistory.map(this.renderMudLine.bind(this))}
              <div className="mud-line mud-input-row">
                <label htmlFor="mud-input">mud&gt;</label>
                <input
                  id="mud-input"
                  ref={function(input) { this.mudInputRef = input; }.bind(this)}
                  value={this.state.mudInput}
                  onChange={this.handleMudInputChange.bind(this)}
                  onKeyDown={this.handleMudKeyDown.bind(this)}
                  autoComplete="off"
                  spellCheck="false"
                />
              </div>
            </div>
          </aside>
        ) : ''}

        {this.state.linkOpen ? (
          <aside
            className="link-window"
            onClick={this.focusLinkInput.bind(this)}
            style={{ transform: 'translate(' + this.state.linkPosition.x + 'px, ' + this.state.linkPosition.y + 'px)' }}
          >
            <header className="link-header" onMouseDown={this.startLinkDrag.bind(this)}>
              <span>link://{this.state.linkRoom} as {this.state.linkAlias}</span>
              <button type="button" onClick={function() { this.setState({ linkOpen: false }); }.bind(this)}>x</button>
            </header>
            <div className="link-body" ref={this.setLinkBodyRef.bind(this)} onScroll={this.handleLinkScroll.bind(this)}>
              {this.state.linkMessages.map(function(message, index) {
                return (
                  <div className="link-line" key={index}>
                    <span>{message.alias}</span>
                    <span>{message.text}</span>
                  </div>
                );
              })}
              <div className="link-input-row">
                <label htmlFor="link-input">say&gt;</label>
                <input
                  id="link-input"
                  ref={function(input) { this.linkInputRef = input; }.bind(this)}
                  value={this.state.linkInput}
                  onChange={this.handleLinkInputChange.bind(this)}
                  onKeyDown={this.handleLinkKeyDown.bind(this)}
                  autoComplete="off"
                  spellCheck="false"
                />
              </div>
            </div>
          </aside>
        ) : ''}

        {this.state.signalOpen ? (
          <aside
            className="signal-window"
            onClick={this.focusSignalInput.bind(this)}
            style={{ transform: 'translate(' + this.state.signalPosition.x + 'px, ' + this.state.signalPosition.y + 'px)' }}
          >
            <header className="signal-header" onMouseDown={this.startSignalDrag.bind(this)}>
              <span>signal.shell</span>
              <button type="button" onClick={this.closeSignalWindow.bind(this)} aria-label="Close signal shell">x</button>
            </header>
            <div className="signal-body" ref={this.setSignalBodyRef.bind(this)}>
              {this.state.signalHistory.map(this.renderSignalLine.bind(this))}
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
