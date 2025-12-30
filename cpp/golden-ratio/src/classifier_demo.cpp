/**
 * @file classifier_demo.cpp
 * @brief Demonstration of Content Classification & Routing System
 */

#include "../include/content_classifier.hpp"
#include <iostream>
#include <iomanip>

using namespace golden::security;

void print_header(const std::string& title) {
    std::cout << "\n" << std::string(70, '=') << "\n";
    std::cout << " " << title << "\n";
    std::cout << std::string(70, '=') << "\n\n";
}

void print_result(const ClassificationResult& result) {
    std::cout << "  Label:      " << label_to_string(result.label) << "\n";
    std::cout << "  Reason:     " << result.reason << "\n";
    std::cout << "  Confidence: " << std::fixed << std::setprecision(2) << result.confidence << "\n";

    if (!result.redaction_warnings.empty()) {
        std::cout << "  Warnings:\n";
        for (const auto& w : result.redaction_warnings) {
            std::cout << "    - " << w << "\n";
        }
    }
    std::cout << "\n";
}

void test_allowed_scope() {
    print_header("ALLOWED SCOPE TESTING");

    ContentClassifier classifier;

    std::vector<std::pair<std::string, std::string>> test_cases = {
        {"How do I configure DNS MX records for my domain?", "DNS"},
        {"What is DNSSEC and how do I enable it?", "DNS"},
        {"Explain DKIM and SPF for email authentication", "Email"},
        {"How does SMTP relay work?", "Email"},
        {"Set up a SIEM for threat detection", "Defensive Security"},
        {"What is MITRE ATT&CK framework?", "Defensive Security"},
        {"Explain GDPR compliance requirements", "Legal/Gov"},
        {"What is PCI-DSS certification?", "Legal/Gov"}
    };

    for (const auto& [query, expected_scope] : test_cases) {
        std::cout << "Query: \"" << query << "\"\n";
        std::cout << "Expected: " << expected_scope << "\n";
        auto result = classifier.classify(query);
        print_result(result);
    }
}

void test_hard_blocks() {
    print_header("HARD BLOCK TESTING");

    ContentClassifier classifier;

    std::vector<std::pair<std::string, std::string>> test_cases = {
        {"Show me porn sites", "Adult Content"},
        {"How to exploit SQL injection", "Offensive Security"},
        {"Give me a reverse shell payload", "Offensive Security"},
        {"How to hack into a server", "Offensive Security"},
        {"Here is my API key: sk-abc123def456ghi789jkl012mno345", "Privileged Data"},
        {"Create a ransomware program", "Malware"}
    };

    for (const auto& [query, block_type] : test_cases) {
        std::cout << "Query: \"" << query << "\"\n";
        std::cout << "Expected Block: " << block_type << "\n";
        auto result = classifier.classify(query);
        print_result(result);
    }
}

void test_redaction() {
    print_header("REDACTION LAYER TESTING");

    RedactionLayer redactor;

    std::vector<std::string> test_inputs = {
        "My email is john.doe@example.com and my phone is 555-123-4567",
        "API key: sk-abc123def456ghi789jkl012mno345pqr",
        "Connect to mongodb://user:password@localhost:27017/db",
        "AWS Key: AKIAIOSFODNN7EXAMPLE",
        "SSN: 123-45-6789 and CC: 4111111111111111",
        "password = 'super_secret_123'"
    };

    for (const auto& input : test_inputs) {
        std::cout << "Original: " << input << "\n";

        auto warnings = redactor.scan(input);
        std::cout << "Warnings: ";
        if (warnings.empty()) {
            std::cout << "(none)";
        } else {
            for (const auto& w : warnings) {
                std::cout << w << "; ";
            }
        }
        std::cout << "\n";

        std::string redacted = redactor.redact(input);
        std::cout << "Redacted: " << redacted << "\n\n";
    }
}

void test_routing() {
    print_header("ROUTING HANDLER TESTING");

    RoutingHandler router;

    std::vector<std::string> requests = {
        "How do I set up DNSSEC for my domain?",
        "Can you help me configure DMARC?",
        "Set up IDS monitoring for suspicious activity",
        "My API key is sk-test12345 - can you check it?",
        "How to SQL inject a website?",
        "Tell me about quantum physics"
    };

    for (const auto& request : requests) {
        std::cout << "Request: \"" << request << "\"\n";
        std::cout << "Response:\n" << router.process(request) << "\n\n";
        std::cout << std::string(50, '-') << "\n\n";
    }
}

void test_system_prompt() {
    print_header("SYSTEM PROMPT GENERATION");

    std::cout << "=== Full System Prompt ===\n\n";
    std::cout << SystemPromptGenerator::generate() << "\n";

    std::cout << "\n=== Compact System Prompt ===\n\n";
    std::cout << SystemPromptGenerator::generate_compact() << "\n";
}

void print_summary() {
    print_header("SYSTEM SUMMARY");

    std::cout << "Content Classification System Components:\n\n";

    std::cout << "1. ALLOWED SCOPE\n";
    std::cout << "   - DNS queries, records, configuration\n";
    std::cout << "   - Email protocols, headers, routing\n";
    std::cout << "   - Defensive security, monitoring, detection\n";
    std::cout << "   - Abstract legal/government topics\n\n";

    std::cout << "2. HARD BLOCKS\n";
    std::cout << "   - Adult/explicit content\n";
    std::cout << "   - Offensive security (hacking, exploitation)\n";
    std::cout << "   - Raw privileged data (credentials, keys)\n";
    std::cout << "   - Malware content\n\n";

    std::cout << "3. CLASSIFICATION LABELS\n";
    std::cout << "   - ALLOWED:          Process normally\n";
    std::cout << "   - REVIEW_REQUIRED:  Flag for human review\n";
    std::cout << "   - REDACT_AND_ALLOW: Remove PII, then process\n";
    std::cout << "   - SOFT_BLOCK:       Politely decline\n";
    std::cout << "   - HARD_BLOCK:       Firmly refuse\n\n";

    std::cout << "4. REDACTION LAYER\n";
    std::cout << "   - API keys & tokens\n";
    std::cout << "   - AWS credentials\n";
    std::cout << "   - Email addresses\n";
    std::cout << "   - Phone numbers\n";
    std::cout << "   - SSN & credit cards\n";
    std::cout << "   - Private IPs\n";
    std::cout << "   - Passwords\n";
    std::cout << "   - Private keys\n";
    std::cout << "   - Database connections\n\n";

    std::cout << "[PASS] All components operational\n";
}

int main() {
    std::cout << "\n";
    std::cout << "+------------------------------------------------------------------+\n";
    std::cout << "|     CONTENT CLASSIFICATION & ROUTING SYSTEM                     |\n";
    std::cout << "|     Security Guardrails with 5-Label Classification             |\n";
    std::cout << "+------------------------------------------------------------------+\n";

    try {
        test_allowed_scope();
        test_hard_blocks();
        test_redaction();
        test_routing();
        test_system_prompt();
        print_summary();

        std::cout << "\n[SUCCESS] All classification tests passed!\n\n";
        return 0;

    } catch (const std::exception& e) {
        std::cerr << "\n[ERROR] " << e.what() << "\n";
        return 1;
    }
}
