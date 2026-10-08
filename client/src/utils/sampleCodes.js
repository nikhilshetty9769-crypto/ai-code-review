/**
 * Curated sample snippets with realistic bugs, security smells, or inefficiencies
 * across all 9 supported languages to provide instant interactive testing.
 */

export const SUPPORTED_LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', monacoLang: 'javascript', extension: '.js' },
  { id: 'typescript', name: 'TypeScript', monacoLang: 'typescript', extension: '.ts' },
  { id: 'python', name: 'Python', monacoLang: 'python', extension: '.py' },
  { id: 'java', name: 'Java', monacoLang: 'java', extension: '.java' },
  { id: 'cpp', name: 'C++', monacoLang: 'cpp', extension: '.cpp' },
  { id: 'c', name: 'C', monacoLang: 'c', extension: '.c' },
  { id: 'go', name: 'Go', monacoLang: 'go', extension: '.go' },
  { id: 'rust', name: 'Rust', monacoLang: 'rust', extension: '.rs' },
  { id: 'ruby', name: 'Ruby', monacoLang: 'ruby', extension: '.rb' },
];

export const SAMPLE_CODES = {
  javascript: `// Vulnerable User Authentication Handler
async function authenticateUser(req, res) {
  const { username, password } = req.body;

  // Potential SQL Injection vulnerability
  const query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'";
  const user = await db.query(query);

  if (user.length > 0) {
    // Storing plain text password in token or session
    const token = jwt.sign({ id: user[0].id, secretPass: password }, "secret-key-123");
    res.json({ success: true, token });
  } else {
    res.status(401).send("Invalid credentials");
  }
}
`,

  typescript: `// Order Processing with loose types and missing null checks
interface Item {
  id: string;
  price?: number;
  quantity: number;
}

function calculateOrderTotal(items: any[], discountRate: number): number {
  let total = 0;
  
  for (let i = 0; i <= items.length; i++) { // Off-by-one boundary bug
    const item = items[i];
    // Potential runtime error: accessing price on undefined or unvalidated number
    total += item.price * item.quantity;
  }

  if (discountRate > 0) {
    total = total - (total * discountRate);
  }

  return total;
}
`,

  python: `import sqlite3
import hashlib

def login_user(username, raw_password):
    # Security issue: using weak hashing algorithm (MD5) and string formatting in SQL
    hashed_pwd = hashlib.md5(raw_password.encode()).hexdigest()
    
    conn = sqlite3.connect('app.db')
    cursor = conn.cursor()
    
    # SQL injection vulnerability
    query = f"SELECT id, role FROM accounts WHERE user = '{username}' AND password = '{hashed_pwd}'"
    cursor.execute(query)
    
    user = cursor.fetchone()
    # Missing conn.close() resource leak
    return user
`,

  java: `public class BankTransferService {
    private double balance;

    // Concurrency issue: non-synchronized balance modification
    public void transfer(Account target, double amount) {
        if (amount > 0) {
            // Missing null check on target
            if (this.balance >= amount) {
                this.balance -= amount;
                target.deposit(amount);
                System.out.println("Transfer successful: " + amount);
            }
        }
    }
}
`,

  cpp: `#include <iostream>
#include <cstring>

void processInput(const char* userInput) {
    // Security buffer overflow vulnerability
    char buffer[32];
    strcpy(buffer, userInput); // Unchecked bound copy
    std::cout << "Processed buffer: " << buffer << std::endl;

    // Memory leak
    int* numbers = new int[100];
    numbers[0] = 42;
    // Missing delete[] numbers;
}
`,

  c: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void readConfigFile(const char* filepath) {
    FILE *file = fopen(filepath, "r");
    char line[64];
    
    // Missing file null check
    while (fgets(line, sizeof(line), file)) {
        printf("Config line: %s", line);
    }
    
    // Dangling file pointer / missed fclose
}
`,

  go: `package main

import (
	"database/sql"
	"fmt"
	"net/http"
)

func getUserHandler(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	userId := r.URL.Query().Get("id")

	// SQL Injection smell: string formatting instead of parameterized query
	query := fmt.Sprintf("SELECT name, email FROM users WHERE id = '%s'", userId)
	rows, err := db.Query(query)
	if err != nil {
		// Missing error response to client and unclosed rows leak
		return
	}
	defer rows.Close()
}
`,

  rust: `// Inefficient string cloning and potential unwrap panic
pub fn find_highest_scorer(scores: &Vec<(String, u32)>) -> (String, u32) {
    // Inefficient: passing &Vec instead of slice &[...]
    let mut highest = scores[0].clone(); // Can panic if vector is empty!

    for item in scores {
        if item.1 > highest.1 {
            highest = item.clone();
        }
    }

    highest
}
`,

  ruby: `def calculate_user_tax(gross_income, deduction)
  # Missing type validation and potential division by zero
  taxable = gross_income - deduction
  tax_rate = 0.25

  # Ruby SQL string interpolation smell
  ActiveRecord::Base.connection.execute(
    "UPDATE users SET taxable_income = #{taxable} WHERE id = 1"
  )

  taxable * tax_rate
end
`,
};
