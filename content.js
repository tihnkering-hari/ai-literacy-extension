// content.js - FIXED VERSION with better selectors and debugging
console.log('🚀 AI Literacy Assistant: Script loaded!');

class AILiteracyAssistant {
  constructor() {
    console.log('🎯 AI Literacy Assistant: Initializing...');
    this.messageCount = 0;
    this.panel = null;
    
    // Try to attach immediately and also watch for changes
    setTimeout(() => this.init(), 1000);
    setTimeout(() => this.init(), 3000); // Try again after 3 seconds
  }

  init() {
    console.log('📍 AI Literacy Assistant: Looking for input field...');
    this.findAndAugmentInput();
    this.initializeObserver();
  }

  initializeObserver() {
    // Watch for page changes
    const observer = new MutationObserver(() => {
      if (!this.panel) {
        this.findAndAugmentInput();
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Module 2: Under-Specification Detection
  checkUnderSpecification(prompt) {
    const issues = [];
    const vaguePhrases = [
      'write something about',
      'tell me about',
      'explain',
      'create a',
      'make a',
      'give me'
    ];
    
    const promptLower = prompt.toLowerCase();
    
    // Check for vague requests
    for (const phrase of vaguePhrases) {
      if (promptLower.includes(phrase) && prompt.length < 100) {
        issues.push({
          type: 'vague',
          message: '🚨 Too vague! Add: Who is this for? What format? What goal?',
          severity: 'high'
        });
        break; // Only show one vague warning
      }
    }
    
    // Check for missing context
    if (!promptLower.includes('for') && 
        !promptLower.includes('audience') && 
        prompt.length < 50) {
      issues.push({
        type: 'context',
        message: '💡 Tip: Specify your audience (e.g., "for beginners")',
        severity: 'medium'
      });
    }
    
    return issues;
  }

  findAndAugmentInput() {
    // Multiple selectors for different versions of ChatGPT/Claude interfaces
    const selectors = [
      '#prompt-textarea',  // New ChatGPT
      'textarea[data-id]', // Old ChatGPT
      'div[contenteditable="true"]', // Claude
      'textarea[placeholder*="Message"]', // Generic
      'textarea[placeholder*="Ask"]', // Alternative
      '.ProseMirror', // Some rich text editors
      'textarea', // Last resort - first textarea on page
    ];
    
    let input = null;
    
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        console.log(`✅ AI Literacy Assistant: Found input with selector: ${selector}`);
        input = element;
        break;
      }
    }
    
    if (input && !input.dataset.aiLiteracy) {
      console.log('🎉 AI Literacy Assistant: Augmenting input field!');
      input.dataset.aiLiteracy = 'true';
      this.augmentInput(input);
    } else if (!input) {
      console.log('⚠️ AI Literacy Assistant: No input field found yet...');
    }
  }

  augmentInput(input) {
    // Create feedback panel if it doesn't exist
    if (!this.panel) {
      this.panel = document.createElement('div');
      this.panel.className = 'ai-literacy-panel';
      this.panel.id = 'ai-literacy-feedback';
      this.panel.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 20px;
        width: 300px;
        background: white;
        border: 2px solid #4CAF50;
        border-radius: 8px;
        padding: 12px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 999999;
        display: none;
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 14px;
        line-height: 1.4;
      `;
      document.body.appendChild(this.panel);
      console.log('📦 AI Literacy Assistant: Panel created!');
    }

    // Monitor input changes
    const checkInput = () => {
      const prompt = input.value || input.textContent || input.innerText;
      console.log('📝 AI Literacy Assistant: Input changed, checking...', prompt.substring(0, 50));
      
      if (prompt && prompt.length > 5) {
        const issues = this.checkUnderSpecification(prompt);
        this.displayFeedback(issues);
      } else {
        this.panel.style.display = 'none';
      }
    };

    // Listen for various input events
    input.addEventListener('input', checkInput);
    input.addEventListener('keyup', checkInput);
    input.addEventListener('paste', () => setTimeout(checkInput, 100));
    
    // For contenteditable divs
    if (input.contentEditable === 'true') {
      input.addEventListener('DOMSubtreeModified', checkInput);
    }

    console.log('👂 AI Literacy Assistant: Listeners attached!');
  }

  displayFeedback(issues) {
    if (!this.panel) return;
    
    if (issues.length === 0) {
      this.panel.style.display = 'none';
      return;
    }

    console.log('💬 AI Literacy Assistant: Showing feedback!', issues);

    let html = '<div style="font-weight: bold; margin-bottom: 8px; color: #333;">✨ AI Literacy Check</div>';
    issues.forEach(issue => {
      const color = issue.severity === 'high' ? '#f44336' : 
                    issue.severity === 'medium' ? '#ff9800' : '#2196F3';
      html += `<div style="color: ${color}; margin: 4px 0; font-size: 14px;">${issue.message}</div>`;
    });

    this.panel.innerHTML = html;
    this.panel.style.display = 'block';

    // Keep visible while typing
    clearTimeout(this.hideTimeout);
    this.hideTimeout = setTimeout(() => {
      this.panel.style.display = 'none';
    }, 10000); // Hide after 10 seconds
  }
}

// Start the extension
console.log('🏁 AI Literacy Assistant: Starting...');
const assistant = new AILiteracyAssistant();

// Also try to initialize on common page events
document.addEventListener('DOMContentLoaded', () => {
  console.log('📄 AI Literacy Assistant: DOM loaded, reinitializing...');
  setTimeout(() => assistant.init(), 500);
});

window.addEventListener('load', () => {
  console.log('🌐 AI Literacy Assistant: Window loaded, reinitializing...');
  setTimeout(() => assistant.init(), 500);
});