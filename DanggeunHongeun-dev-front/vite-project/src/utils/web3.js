import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';

// Celo Alfajores 네트워크 정보
const CELO_ALFAJORES = {
  chainId: '0xAEF3', // 44787 in hex
  chainName: 'Celo Alfajores Testnet',
  nativeCurrency: {
    name: 'CELO',
    symbol: 'CELO',
    decimals: 18,
  },
  rpcUrls: ['https://alfajores-forno.celo-testnet.org'],
  blockExplorerUrls: ['https://explorer.celo.org/alfajores'],
};

// 🔥 여기에 배포한 컨트랙트 주소를 입력하세요!
const CONTRACT_ADDRESS = '0x1362F71471AE1c2856d0ac5cA4e7b09Bd1363D8C';

// 스마트 컨트랙트 ABI (Remix에서 복사)
const CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "admin",
        "type": "address"
      }
    ],
    "name": "AdminAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "admin",
        "type": "address"
      }
    ],
    "name": "AdminRemoved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "studentAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "email",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "username",
        "type": "string"
      }
    ],
    "name": "StudentRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "studentAddress",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "verifier",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "StudentVerified",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "adminAddress",
        "type": "address"
      }
    ],
    "name": "addAdmin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "admins",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "studentAddress",
        "type": "address"
      }
    ],
    "name": "getStudentInfo",
    "outputs": [
      {
        "internalType": "string",
        "name": "email",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "username",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "university",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "isVerified",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "verificationTime",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "studentAddress",
        "type": "address"
      }
    ],
    "name": "getVerificationStatus",
    "outputs": [
      {
        "internalType": "bool",
        "name": "isVerified",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "verificationTime",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "verifier",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getVerifiedStudentCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "start",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "limit",
        "type": "uint256"
      }
    ],
    "name": "getVerifiedStudents",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "adminAddress",
        "type": "address"
      }
    ],
    "name": "isAdmin",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "studentAddress",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "email",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "username",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "university",
        "type": "string"
      }
    ],
    "name": "registerStudent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "adminAddress",
        "type": "address"
      }
    ],
    "name": "removeAdmin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "students",
    "outputs": [
      {
        "internalType": "string",
        "name": "email",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "username",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "university",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "isVerified",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "verificationTime",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "verifier",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "usedEmails",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "verifiedStudents",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "studentAddress",
        "type": "address"
      }
    ],
    "name": "verifyStudent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

class Web3Service {
  constructor() {
    this.web3 = null;
    this.contract = null;
    this.account = null;
  }

  // MetaMask 연결
  async connectWallet() {
    try {
      const provider = await detectEthereumProvider();
      
      if (!provider) {
        throw new Error('MetaMask가 설치되지 않았습니다.');
      }

      this.web3 = new Web3(provider);
      
      // 계정 연결 요청
      const accounts = await provider.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('MetaMask에서 계정을 찾을 수 없습니다.');
      }

      this.account = accounts[0];

      // Celo Alfajores 네트워크 확인 및 전환
      await this.switchToCeloAlfajores();

      // 스마트 컨트랙트 인스턴스 생성
      this.contract = new this.web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

      return {
        success: true,
        account: this.account,
        message: 'MetaMask 연결 성공!'
      };

    } catch (error) {
      console.error('MetaMask 연결 실패:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Celo Alfajores 네트워크로 전환
  async switchToCeloAlfajores() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: CELO_ALFAJORES.chainId }],
      });
    } catch (switchError) {
      // 네트워크가 추가되지 않은 경우
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [CELO_ALFAJORES],
          });
        } catch (addError) {
          throw new Error('Celo Alfajores 네트워크 추가에 실패했습니다.');
        }
      } else {
        throw new Error('Celo Alfajores 네트워크로 전환에 실패했습니다.');
      }
    }
  }

  // 지갑 주소 반환
  getAccount() {
    return this.account;
  }

  // 계정 변경 감지
  onAccountChange(callback) {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        this.account = accounts[0] || null;
        callback(this.account);
      });
    }
  }

  // 스마트 컨트랙트 메서드들
  async isAdmin(address) {
    if (!this.contract) return false;
    try {
      return await this.contract.methods.isAdmin(address).call();
    } catch (error) {
      console.error('관리자 확인 실패:', error);
      return false;
    }
  }

  async getVerificationStatus(address) {
    if (!this.contract) return null;
    try {
      const result = await this.contract.methods.getVerificationStatus(address).call();
      return {
        isVerified: result[0],
        verificationTime: result[1],
        verifier: result[2]
      };
    } catch (error) {
      console.error('인증 상태 확인 실패:', error);
      return null;
    }
  }

  // web3.js의 verifyStudent 함수를 이것으로 교체

async verifyStudent(studentAddress) {
  if (!this.contract || !this.account) {
    throw new Error('지갑이 연결되지 않았습니다.');
  }

  try {
    // 🔍 1. 먼저 이미 인증된 사용자인지 확인
    console.log('사용자 인증 상태 확인 중...');
    const status = await this.contract.methods
      .getVerificationStatus(studentAddress)
      .call();
    
    if (status[0]) { // isVerified가 true인 경우
      throw new Error(`이미 인증된 사용자입니다. 인증 시간: ${new Date(Number(status[1]) * 1000).toLocaleString()}`);
    }

    // 🔍 2. 관리자 권한 재확인
    const isAdmin = await this.contract.methods
      .isAdmin(this.account)
      .call();
    
    if (!isAdmin) {
      throw new Error('관리자 권한이 없습니다.');
    }

    console.log('가스 추정 중...');
    
    // 🔍 3. 가스 추정 (BigInt 처리)
    let gasEstimate;
    try {
      const rawGasEstimate = await this.contract.methods
        .verifyStudent(studentAddress)
        .estimateGas({ from: this.account });
      
      // 🔧 BigInt를 숫자로 변환
      gasEstimate = Number(rawGasEstimate);
      
      console.log('추정 가스:', gasEstimate);
    } catch (estimateError) {
      console.error('가스 추정 실패:', estimateError);
      
      // 특정 오류 메시지 확인
      if (estimateError.message.includes('revert')) {
        throw new Error('트랜잭션이 실행될 수 없습니다. 이미 인증된 사용자이거나 권한이 없습니다.');
      }
      
      // 기본 가스 사용
      gasEstimate = 300000;
      console.log('기본 가스 사용:', gasEstimate);
    }

    console.log('트랜잭션 실행 중...');
    
    // 🔍 4. 트랜잭션 실행 (BigInt 처리)
    const rawGasPrice = await this.web3.eth.getGasPrice();
    
    // 🔧 BigInt를 문자열로 변환
    const gasPrice = rawGasPrice.toString();
    const finalGas = Math.floor(gasEstimate * 1.3); // 30% 여유

    console.log('트랜잭션 파라미터:', {
      gas: finalGas,
      gasPrice: gasPrice,
      from: this.account
    });

    const result = await this.contract.methods
      .verifyStudent(studentAddress)
      .send({ 
        from: this.account,
        gas: finalGas,
        gasPrice: gasPrice
      });

    console.log('✅ 인증 트랜잭션 성공:', {
      txHash: result.transactionHash,
      gasUsed: result.gasUsed ? result.gasUsed.toString() : 'N/A',
      blockNumber: result.blockNumber ? result.blockNumber.toString() : 'N/A'
    });

    return {
      success: true,
      txHash: result.transactionHash,
      message: '블록체인 인증 완료!'
    };
    
  } catch (error) {
    console.error('학생 인증 실패:', error);
    
    // 더 구체적인 오류 메시지 제공
    if (error.message.includes('이미 인증된')) {
      throw new Error(error.message);
    } else if (error.message.includes('권한')) {
      throw new Error(error.message);
    } else if (error.message.includes('revert')) {
      throw new Error('스마트 컨트랙트 실행이 거부되었습니다. 이미 인증된 사용자이거나 조건을 만족하지 않습니다.');
    } else if (error.message.includes('BigInt')) {
      throw new Error('트랜잭션 처리 중 타입 오류가 발생했습니다.');
    } else {
      throw new Error('블록체인 인증에 실패했습니다: ' + error.message);
    }
  }
}


// web3.js의 registerStudent 함수 - BigInt 오류 해결 버전

async registerStudent(studentAddress, email, username, university) {
  if (!this.contract || !this.account) {
    throw new Error('지갑이 연결되지 않았습니다.');
  }

  try {
    console.log('🔍 블록체인 등록 디버깅 시작');
    console.log('📋 입력 데이터:', {
      studentAddress,
      email,
      username,
      university,
      currentAccount: this.account
    });

    // 🔍 1. 관리자 권한 확인
    console.log('1️⃣ 관리자 권한 확인 중...');
    const isAdmin = await this.contract.methods
      .isAdmin(this.account)
      .call();
    
    console.log('관리자 권한 결과:', isAdmin);
    if (!isAdmin) {
      throw new Error(`❌ 관리자 권한 없음. 현재 계정: ${this.account}`);
    }

    // 🔍 2. 이메일 중복 확인
    console.log('2️⃣ 이메일 중복 확인 중...');
    const emailUsed = await this.contract.methods
      .usedEmails(email)
      .call();
    
    console.log('이메일 사용 여부:', emailUsed);
    if (emailUsed) {
      throw new Error(`❌ 이미 사용된 이메일: ${email}`);
    }

    // 🔍 3. 지갑 주소 등록 상태 확인
    console.log('3️⃣ 지갑 주소 등록 상태 확인 중...');
    const studentInfo = await this.contract.methods
      .students(studentAddress)
      .call();
    
    console.log('기존 학생 정보:', {
      email: studentInfo.email,
      username: studentInfo.username,
      university: studentInfo.university,
      isVerified: studentInfo.isVerified
    });

    if (studentInfo.email && studentInfo.email.length > 0) {
      throw new Error(`❌ 이미 등록된 지갑 주소: ${studentAddress}`);
    }

    // 🔍 4. 컨트랙트 상태 확인
    console.log('4️⃣ 컨트랙트 기본 정보 확인...');
    const contractOwner = await this.contract.methods.owner().call();
    const verifiedCount = await this.contract.methods.getVerifiedStudentCount().call();
    
    console.log('컨트랙트 정보:', {
      owner: contractOwner,
      verifiedStudentCount: verifiedCount.toString(), // BigInt 변환
      contractAddress: this.contract.options.address
    });

    // 🔍 5. 수동 파라미터 검증
    console.log('5️⃣ 파라미터 검증...');
    if (!studentAddress || studentAddress.length !== 42) {
      throw new Error(`❌ 잘못된 지갑 주소 형식: ${studentAddress}`);
    }
    if (!email || email.length === 0) {
      throw new Error(`❌ 이메일이 비어있음`);
    }
    if (!username || username.length === 0) {
      throw new Error(`❌ 사용자명이 비어있음`);
    }
    if (!university || university.length === 0) {
      throw new Error(`❌ 대학교 정보가 비어있음`);
    }

    // 🔍 6. 가스 추정 (BigInt 처리)
    console.log('6️⃣ 가스 추정 중...');
    let gasEstimate;
    try {
      const rawGasEstimate = await this.contract.methods
        .registerStudent(studentAddress, email, username, university)
        .estimateGas({ from: this.account });
      
      // 🔧 BigInt를 숫자로 변환
      gasEstimate = Number(rawGasEstimate);
      
      console.log('✅ 가스 추정 성공:', gasEstimate);
    } catch (estimateError) {
      console.error('❌ 가스 추정 실패 상세:', {
        message: estimateError.message,
        code: estimateError.code,
        data: estimateError.data
      });
      
      // 기본 가스 사용
      gasEstimate = 350000;
      console.log('🔄 기본 가스 사용:', gasEstimate);
    }

    // 🔍 7. 트랜잭션 실행 (BigInt 처리)
    console.log('7️⃣ 트랜잭션 실행 중...');
    const rawGasPrice = await this.web3.eth.getGasPrice();
    
    // 🔧 BigInt를 문자열로 변환 (Web3에서 문자열 허용)
    const gasPrice = rawGasPrice.toString();
    const finalGas = Math.floor(gasEstimate * 1.5); // 50% 여유
    
    console.log('트랜잭션 파라미터:', {
      gas: finalGas,
      gasPrice: gasPrice,
      from: this.account
    });

    const result = await this.contract.methods
      .registerStudent(studentAddress, email, username, university)
      .send({ 
        from: this.account,
        gas: finalGas,
        gasPrice: gasPrice
      });

    console.log('✅ 트랜잭션 성공:', {
      txHash: result.transactionHash,
      gasUsed: result.gasUsed ? result.gasUsed.toString() : 'N/A',
      blockNumber: result.blockNumber ? result.blockNumber.toString() : 'N/A'
    });

    return {
      success: true,
      txHash: result.transactionHash,
      message: '블록체인 등록 완료!'
    };
    
  } catch (error) {
    console.error('❌ registerStudent 전체 실패:', {
      message: error.message,
      stack: error.stack
    });
    
    throw new Error('블록체인 등록 실패: ' + error.message);
  }
}

}

// 전역 인스턴스 생성
const web3Service = new Web3Service();

export default web3Service;