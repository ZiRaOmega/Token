const fs = require('fs');
const { exec } = require('child_process');

const directories = ['contracts', 'migrations', 'test'];

const tokenContractContent = `
// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
contract MyToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("MyToken", "MTK") {
        _mint(msg.sender, initialSupply); 
    } 
}`;

const migrationScriptContent = `
const MyToken = artifacts.require("MyToken");
module.exports = function(deployer) {
    deployer.deploy(MyToken, 1000000);
};`;

const truffleConfigContent = `
module.exports = {
    networks: {
        development: { 
            host: "127.0.0.1", 
            port: 7545, 
            network_id: "*" 
        }, 
        matic: { 
            provider: () => new HDWalletProvider(process.env.MNEMONIC, 'https://rpc-mumbai.maticvigil.com'), 
            network_id: 80001, 
            confirmations: 2, 
            timeoutBlocks: 200, 
            skipDryRun: true 
        } 
    }, 
    contracts_directory: "./contracts", 
    contracts_build_directory: "./abis", 
    compilers: { 
        solc: { 
            version: "^0.8.0", 
            optimizer: { 
                enabled: true, 
                runs: 200 
            } 
        } 
    } 
};`;

const files = [
    { path: 'contracts/MyToken.sol', content: tokenContractContent },
    { path: 'migrations/2_deploy_contracts.js', content: migrationScriptContent },
    { path: 'truffle-config.js', content: truffleConfigContent }
];

function createDirectories() {
    directories.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`Created directory: ${dir}`);
        }
    });
}

function createFile(filePath, content) {
    fs.writeFileSync(filePath, content);
    console.log(`Created file: ${filePath}`);
}

function installPackages() {
    exec('npm install @openzeppelin/contracts truffle @truffle/hdwallet-provider dotenv', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        console.log(`Stdout: ${stdout}`);
    });
}

createDirectories();
files.forEach(file => createFile(file.path, file.content));
installPackages();
