/**
 * @file content_classifier.hpp
 * @brief Content Classification, Routing & Redaction System
 *
 * Security-focused content classification with:
 *   - Allowed scope: DNS, email, defensive security, abstract legal/gov
 *   - Hard blocks: adult content, offensive security, raw privileged data
 *   - Five classification labels with routing rules
 *   - PII/secrets redaction layer
 */

#ifndef CONTENT_CLASSIFIER_HPP
#define CONTENT_CLASSIFIER_HPP

#include <string>
#include <vector>
#include <unordered_set>
#include <unordered_map>
#include <regex>
#include <functional>
#include <optional>
#include <memory>
#include <sstream>
#include <algorithm>
#include <cctype>

namespace golden {
namespace security {

// ===========================================================================
// CLASSIFICATION LABELS
// ===========================================================================

/**
 * @brief Five classification labels for content routing
 */
enum class ClassificationLabel {
    ALLOWED,           // Safe content within allowed scope
    REVIEW_REQUIRED,   // Needs human review before processing
    REDACT_AND_ALLOW,  // Contains PII/secrets - redact then allow
    SOFT_BLOCK,        // Outside scope but not harmful - reject politely
    HARD_BLOCK         // Strictly prohibited content - reject firmly
};

/**
 * @brief Convert label to string
 */
inline std::string label_to_string(ClassificationLabel label) {
    switch (label) {
        case ClassificationLabel::ALLOWED:         return "ALLOWED";
        case ClassificationLabel::REVIEW_REQUIRED: return "REVIEW_REQUIRED";
        case ClassificationLabel::REDACT_AND_ALLOW: return "REDACT_AND_ALLOW";
        case ClassificationLabel::SOFT_BLOCK:      return "SOFT_BLOCK";
        case ClassificationLabel::HARD_BLOCK:      return "HARD_BLOCK";
        default: return "UNKNOWN";
    }
}

// ===========================================================================
// SCOPE DEFINITIONS
// ===========================================================================

/**
 * @brief Allowed content scope categories
 */
enum class AllowedScope {
    DNS,                // DNS queries, records, configuration
    EMAIL,              // Email protocols, headers, routing
    DEFENSIVE_SECURITY, // Security monitoring, defense, detection
    LEGAL_ABSTRACT,     // Abstract legal/government discussion
    GENERAL_TECH        // General technical content
};

/**
 * @brief Hard block categories - strictly prohibited
 */
enum class HardBlockCategory {
    ADULT_CONTENT,      // NSFW, explicit material
    OFFENSIVE_SECURITY, // Hacking, exploitation, attacks
    PRIVILEGED_DATA,    // Raw credentials, API keys, tokens
    MALWARE,            // Malicious code, viruses
    VIOLENCE            // Harmful/violent content
};

// ===========================================================================
// CLASSIFICATION RESULT
// ===========================================================================

/**
 * @brief Result of content classification
 */
struct ClassificationResult {
    ClassificationLabel label;
    std::string reason;
    std::vector<std::string> matched_patterns;
    std::optional<AllowedScope> scope;
    std::optional<HardBlockCategory> block_category;
    double confidence;  // 0.0 - 1.0
    bool requires_redaction = false;
    std::vector<std::string> redaction_warnings;

    static ClassificationResult allowed(const std::string& reason = "",
                                         AllowedScope scope = AllowedScope::GENERAL_TECH) {
        return {ClassificationLabel::ALLOWED, reason, {}, scope, std::nullopt, 1.0, false, {}};
    }

    static ClassificationResult hard_block(HardBlockCategory cat, const std::string& reason) {
        return {ClassificationLabel::HARD_BLOCK, reason, {}, std::nullopt, cat, 1.0, false, {}};
    }

    static ClassificationResult soft_block(const std::string& reason) {
        return {ClassificationLabel::SOFT_BLOCK, reason, {}, std::nullopt, std::nullopt, 0.8, false, {}};
    }

    static ClassificationResult needs_redaction(const std::vector<std::string>& warnings) {
        return {ClassificationLabel::REDACT_AND_ALLOW, "Contains sensitive data", {},
                std::nullopt, std::nullopt, 0.9, true, warnings};
    }

    static ClassificationResult needs_review(const std::string& reason) {
        return {ClassificationLabel::REVIEW_REQUIRED, reason, {}, std::nullopt, std::nullopt, 0.5, false, {}};
    }
};

// ===========================================================================
// PATTERN MATCHERS
// ===========================================================================

/**
 * @brief Pattern matcher for content classification
 */
class PatternMatcher {
public:
    struct Pattern {
        std::regex regex;
        std::string name;
        double weight;  // Importance weight for scoring
    };

private:
    std::vector<Pattern> patterns_;

public:
    void add_pattern(const std::string& regex_str, const std::string& name, double weight = 1.0) {
        patterns_.push_back({std::regex(regex_str, std::regex::icase), name, weight});
    }

    std::vector<std::string> find_matches(const std::string& content) const {
        std::vector<std::string> matches;
        for (const auto& pattern : patterns_) {
            if (std::regex_search(content, pattern.regex)) {
                matches.push_back(pattern.name);
            }
        }
        return matches;
    }

    double score(const std::string& content) const {
        double total = 0.0;
        for (const auto& pattern : patterns_) {
            if (std::regex_search(content, pattern.regex)) {
                total += pattern.weight;
            }
        }
        return total;
    }

    bool has_any_match(const std::string& content) const {
        for (const auto& pattern : patterns_) {
            if (std::regex_search(content, pattern.regex)) {
                return true;
            }
        }
        return false;
    }
};

// ===========================================================================
// PII/SECRETS REDACTION LAYER
// ===========================================================================

/**
 * @brief Redaction layer for PII and secrets
 */
class RedactionLayer {
public:
    struct RedactionMatch {
        std::string type;
        size_t start;
        size_t end;
        std::string original;  // For logging only, not exposed
    };

private:
    struct RedactionPattern {
        std::regex regex;
        std::string type;
        std::string replacement;
    };

    std::vector<RedactionPattern> patterns_;

public:
    RedactionLayer() {
        // API Keys & Tokens
        add_pattern(R"([a-zA-Z0-9_-]{32,})", "API_KEY", "[REDACTED_API_KEY]");
        add_pattern(R"(Bearer\s+[a-zA-Z0-9_.-]+)", "BEARER_TOKEN", "[REDACTED_BEARER_TOKEN]");
        add_pattern(R"(sk-[a-zA-Z0-9]{32,})", "SECRET_KEY", "[REDACTED_SECRET_KEY]");
        add_pattern(R"(api[_-]?key[\"']?\s*[:=]\s*[\"']?[a-zA-Z0-9_-]+)", "API_KEY_ASSIGNMENT", "[REDACTED_API_KEY]");

        // AWS Credentials
        add_pattern(R"(AKIA[0-9A-Z]{16})", "AWS_ACCESS_KEY", "[REDACTED_AWS_KEY]");
        add_pattern(R"([a-zA-Z0-9/+=]{40})", "AWS_SECRET", "[REDACTED_AWS_SECRET]");

        // Email Addresses
        add_pattern(R"([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})", "EMAIL", "[REDACTED_EMAIL]");

        // Phone Numbers
        add_pattern(R"(\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4})", "PHONE", "[REDACTED_PHONE]");

        // SSN
        add_pattern(R"(\b\d{3}-\d{2}-\d{4}\b)", "SSN", "[REDACTED_SSN]");

        // Credit Cards
        add_pattern(R"(\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13})\b)",
                    "CREDIT_CARD", "[REDACTED_CC]");

        // IP Addresses (private ranges especially)
        add_pattern(R"(\b(?:10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2[0-9]|3[01])\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3})\b)",
                    "PRIVATE_IP", "[REDACTED_IP]");

        // Passwords in context
        add_pattern(R"(password[\"']?\s*[:=]\s*[\"']?[^\s\"']+)", "PASSWORD", "[REDACTED_PASSWORD]");

        // Private Keys
        add_pattern(R"(-----BEGIN\s+(?:RSA\s+)?PRIVATE\s+KEY-----)", "PRIVATE_KEY", "[REDACTED_PRIVATE_KEY]");

        // Database Connection Strings
        add_pattern(R"((?:mongodb|mysql|postgres|redis):\/\/[^\s]+)", "DB_CONNECTION", "[REDACTED_DB_CONN]");
    }

    void add_pattern(const std::string& regex_str, const std::string& type, const std::string& replacement) {
        patterns_.push_back({std::regex(regex_str, std::regex::icase), type, replacement});
    }

    /**
     * @brief Scan content for sensitive data
     * @return List of warnings about found sensitive data
     */
    std::vector<std::string> scan(const std::string& content) const {
        std::vector<std::string> warnings;
        std::unordered_set<std::string> found_types;

        for (const auto& pattern : patterns_) {
            if (std::regex_search(content, pattern.regex)) {
                if (found_types.find(pattern.type) == found_types.end()) {
                    found_types.insert(pattern.type);
                    warnings.push_back("Found " + pattern.type + " in content");
                }
            }
        }

        return warnings;
    }

    /**
     * @brief Redact sensitive data from content
     * @return Redacted content
     */
    std::string redact(const std::string& content) const {
        std::string result = content;

        for (const auto& pattern : patterns_) {
            result = std::regex_replace(result, pattern.regex, pattern.replacement);
        }

        return result;
    }

    /**
     * @brief Check if content contains any sensitive data
     */
    bool contains_sensitive(const std::string& content) const {
        for (const auto& pattern : patterns_) {
            if (std::regex_search(content, pattern.regex)) {
                return true;
            }
        }
        return false;
    }
};

// ===========================================================================
// CONTENT CLASSIFIER
// ===========================================================================

/**
 * @brief Main content classifier with scope, blocks, and routing
 */
class ContentClassifier {
private:
    PatternMatcher allowed_dns_;
    PatternMatcher allowed_email_;
    PatternMatcher allowed_defensive_;
    PatternMatcher allowed_legal_;

    PatternMatcher block_adult_;
    PatternMatcher block_offensive_;
    PatternMatcher block_privileged_;
    PatternMatcher block_malware_;

    RedactionLayer redaction_;

public:
    ContentClassifier() {
        initialize_allowed_patterns();
        initialize_block_patterns();
    }

    /**
     * @brief Classify content and determine routing
     */
    ClassificationResult classify(const std::string& content) const {
        std::string normalized = normalize_content(content);

        // Step 1: Check hard blocks first (highest priority)
        auto block_result = check_hard_blocks(normalized);
        if (block_result.label == ClassificationLabel::HARD_BLOCK) {
            return block_result;
        }

        // Step 2: Check for sensitive data requiring redaction
        auto redaction_warnings = redaction_.scan(normalized);
        if (!redaction_warnings.empty()) {
            return ClassificationResult::needs_redaction(redaction_warnings);
        }

        // Step 3: Check if content is within allowed scope
        auto scope_result = check_allowed_scope(normalized);
        if (scope_result.has_value()) {
            return ClassificationResult::allowed("Within allowed scope", scope_result.value());
        }

        // Step 4: Check for ambiguous content requiring review
        if (is_ambiguous(normalized)) {
            return ClassificationResult::needs_review("Content requires human review");
        }

        // Step 5: Default to soft block for out-of-scope content
        return ClassificationResult::soft_block("Content outside allowed scope");
    }

    /**
     * @brief Get redaction layer for direct access
     */
    const RedactionLayer& redaction() const { return redaction_; }
    RedactionLayer& redaction() { return redaction_; }

private:
    void initialize_allowed_patterns() {
        // DNS scope
        allowed_dns_.add_pattern(R"(\b(?:DNS|nameserver|MX|CNAME|A\s+record|AAAA|TXT|SOA|NS)\b)", "dns_records", 2.0);
        allowed_dns_.add_pattern(R"(\b(?:dig|nslookup|host|whois|domain)\b)", "dns_tools", 1.5);
        allowed_dns_.add_pattern(R"(\b(?:zone\s+file|bind|named\.conf|resolv\.conf)\b)", "dns_config", 1.5);
        allowed_dns_.add_pattern(R"(\b(?:DNSSEC|DANE|CAA)\b)", "dns_security", 2.0);

        // Email scope
        allowed_email_.add_pattern(R"(\b(?:SMTP|IMAP|POP3|DKIM|SPF|DMARC)\b)", "email_protocols", 2.0);
        allowed_email_.add_pattern(R"(\b(?:MTA|mail\s+server|postfix|sendmail|exim)\b)", "email_servers", 1.5);
        allowed_email_.add_pattern(R"(\b(?:email\s+header|Return-Path|Received|X-Originating)\b)", "email_headers", 1.5);
        allowed_email_.add_pattern(R"(\b(?:mail\s+routing|relay|bounce)\b)", "email_routing", 1.0);

        // Defensive security scope
        allowed_defensive_.add_pattern(R"(\b(?:SIEM|IDS|IPS|firewall|WAF)\b)", "defense_tools", 2.0);
        allowed_defensive_.add_pattern(R"(\b(?:threat\s+detection|incident\s+response|forensics)\b)", "defense_activities", 2.0);
        allowed_defensive_.add_pattern(R"(\b(?:log\s+analysis|monitoring|alerting|anomaly)\b)", "defense_monitoring", 1.5);
        allowed_defensive_.add_pattern(R"(\b(?:hardening|patching|vulnerability\s+scan)\b)", "defense_posture", 1.5);
        allowed_defensive_.add_pattern(R"(\b(?:SOC|security\s+operations|blue\s+team)\b)", "defense_teams", 2.0);
        allowed_defensive_.add_pattern(R"(\b(?:MITRE\s+ATT&CK|kill\s+chain|IOC|indicator)\b)", "defense_frameworks", 2.0);

        // Abstract legal/government scope
        allowed_legal_.add_pattern(R"(\b(?:GDPR|HIPAA|PCI[-\s]DSS|SOX|CCPA)\b)", "compliance", 2.0);
        allowed_legal_.add_pattern(R"(\b(?:compliance|regulation|policy|governance)\b)", "governance", 1.5);
        allowed_legal_.add_pattern(R"(\b(?:audit|assessment|framework|standard)\b)", "assessment", 1.0);
        allowed_legal_.add_pattern(R"(\b(?:data\s+protection|privacy|consent)\b)", "privacy_law", 1.5);
    }

    void initialize_block_patterns() {
        // Adult content patterns
        block_adult_.add_pattern(R"(\b(?:porn|xxx|nsfw|explicit|nude)\b)", "adult_explicit", 3.0);
        block_adult_.add_pattern(R"(\b(?:escort|cam\s*girl|onlyfans)\b)", "adult_services", 2.0);

        // Offensive security patterns (attacks, exploitation)
        block_offensive_.add_pattern(R"(\b(?:exploit|payload|shellcode|rootkit)\b)", "exploitation", 3.0);
        block_offensive_.add_pattern(R"(\b(?:SQL\s*injection|XSS|RCE|LFI|RFI)\b)", "attack_vectors", 3.0);
        block_offensive_.add_pattern(R"(\b(?:metasploit|cobalt\s*strike|mimikatz)\b)", "attack_tools", 3.0);
        block_offensive_.add_pattern(R"(\b(?:brute\s*force|password\s*crack|hash\s*crack)\b)", "credential_attacks", 2.5);
        block_offensive_.add_pattern(R"(\b(?:reverse\s*shell|bind\s*shell|c2|command\s*and\s*control)\b)", "c2", 3.0);
        block_offensive_.add_pattern(R"(\b(?:privilege\s*escalation|lateral\s*movement)\b)", "post_exploit", 2.5);
        block_offensive_.add_pattern(R"(\b(?:red\s*team|penetration\s*test|pentest)\b)", "offensive_ops", 2.0);
        block_offensive_.add_pattern(R"(\b(?:how\s+to\s+hack|hack\s+into)\b)", "hacking_intent", 3.0);

        // Privileged data patterns
        block_privileged_.add_pattern(R"(-----BEGIN\s+(?:RSA\s+)?PRIVATE\s+KEY-----)", "private_key", 3.0);
        block_privileged_.add_pattern(R"(\b(?:root|admin)\s*password\s*[:=])", "root_creds", 3.0);
        block_privileged_.add_pattern(R"(\bAKIA[0-9A-Z]{16}\b)", "aws_key", 3.0);
        block_privileged_.add_pattern(R"((?:secret|token|key)\s*[:=]\s*['\"][a-zA-Z0-9]{20,})", "raw_secrets", 3.0);

        // Malware patterns
        block_malware_.add_pattern(R"(\b(?:ransomware|cryptolocker|wannacry)\b)", "ransomware", 3.0);
        block_malware_.add_pattern(R"(\b(?:trojan|backdoor|keylogger|spyware)\b)", "malware_types", 3.0);
        block_malware_.add_pattern(R"(\b(?:virus|worm|botnet)\b)", "malware_general", 2.5);
    }

    std::string normalize_content(const std::string& content) const {
        std::string result = content;
        // Convert to lowercase for matching
        std::transform(result.begin(), result.end(), result.begin(),
                       [](unsigned char c) { return std::tolower(c); });
        return result;
    }

    ClassificationResult check_hard_blocks(const std::string& content) const {
        // Check adult content
        if (block_adult_.has_any_match(content)) {
            return ClassificationResult::hard_block(
                HardBlockCategory::ADULT_CONTENT,
                "Adult/explicit content is not permitted"
            );
        }

        // Check offensive security
        if (block_offensive_.score(content) >= 2.0) {
            return ClassificationResult::hard_block(
                HardBlockCategory::OFFENSIVE_SECURITY,
                "Offensive security/attack content is not permitted"
            );
        }

        // Check privileged data
        if (block_privileged_.has_any_match(content)) {
            return ClassificationResult::hard_block(
                HardBlockCategory::PRIVILEGED_DATA,
                "Raw credentials and privileged data cannot be processed"
            );
        }

        // Check malware
        if (block_malware_.has_any_match(content)) {
            return ClassificationResult::hard_block(
                HardBlockCategory::MALWARE,
                "Malware-related content is not permitted"
            );
        }

        // Not blocked
        return ClassificationResult::allowed();
    }

    std::optional<AllowedScope> check_allowed_scope(const std::string& content) const {
        // Check each allowed scope
        if (allowed_dns_.score(content) >= 1.5) {
            return AllowedScope::DNS;
        }
        if (allowed_email_.score(content) >= 1.5) {
            return AllowedScope::EMAIL;
        }
        if (allowed_defensive_.score(content) >= 2.0) {
            return AllowedScope::DEFENSIVE_SECURITY;
        }
        if (allowed_legal_.score(content) >= 1.5) {
            return AllowedScope::LEGAL_ABSTRACT;
        }

        return std::nullopt;
    }

    bool is_ambiguous(const std::string& content) const {
        // Content that matches some patterns but not clearly in scope
        double dns_score = allowed_dns_.score(content);
        double email_score = allowed_email_.score(content);
        double defense_score = allowed_defensive_.score(content);
        double legal_score = allowed_legal_.score(content);

        // Partial matches suggest ambiguity
        return (dns_score > 0 && dns_score < 1.5) ||
               (email_score > 0 && email_score < 1.5) ||
               (defense_score > 0 && defense_score < 2.0) ||
               (legal_score > 0 && legal_score < 1.5);
    }
};

// ===========================================================================
// ROUTING HANDLER
// ===========================================================================

/**
 * @brief Routes requests based on classification
 */
class RoutingHandler {
public:
    using ResponseHandler = std::function<std::string(const std::string&, const ClassificationResult&)>;

private:
    std::unordered_map<ClassificationLabel, ResponseHandler> handlers_;
    ContentClassifier classifier_;

public:
    RoutingHandler() {
        // Default handlers for each classification
        handlers_[ClassificationLabel::ALLOWED] = [](const std::string& content, const ClassificationResult& result) {
            return "Request processed successfully.";
        };

        handlers_[ClassificationLabel::REVIEW_REQUIRED] = [](const std::string& content, const ClassificationResult& result) {
            return "This request requires human review before processing. Reason: " + result.reason;
        };

        handlers_[ClassificationLabel::REDACT_AND_ALLOW] = [this](const std::string& content, const ClassificationResult& result) {
            std::string warnings = "Sensitive data detected and redacted:\n";
            for (const auto& w : result.redaction_warnings) {
                warnings += "  - " + w + "\n";
            }
            std::string redacted = classifier_.redaction().redact(content);
            return warnings + "\nRedacted content processed.";
        };

        handlers_[ClassificationLabel::SOFT_BLOCK] = [](const std::string& content, const ClassificationResult& result) {
            return "I apologize, but this request is outside my allowed scope. " + result.reason +
                   "\n\nI can help with:\n"
                   "  - DNS queries and configuration\n"
                   "  - Email protocols and routing\n"
                   "  - Defensive security (SIEM, IDS, monitoring)\n"
                   "  - Abstract legal/compliance topics";
        };

        handlers_[ClassificationLabel::HARD_BLOCK] = [](const std::string& content, const ClassificationResult& result) {
            return "This request cannot be processed. " + result.reason +
                   "\n\nThis type of content is strictly prohibited.";
        };
    }

    /**
     * @brief Set custom handler for a classification
     */
    void set_handler(ClassificationLabel label, ResponseHandler handler) {
        handlers_[label] = std::move(handler);
    }

    /**
     * @brief Process a request through classification and routing
     */
    std::string process(const std::string& content) {
        auto result = classifier_.classify(content);
        auto it = handlers_.find(result.label);

        if (it != handlers_.end()) {
            return it->second(content, result);
        }

        return "Unknown classification. Request not processed.";
    }

    /**
     * @brief Get classification without routing
     */
    ClassificationResult classify(const std::string& content) const {
        return classifier_.classify(content);
    }

    /**
     * @brief Access classifier for configuration
     */
    ContentClassifier& classifier() { return classifier_; }
};

// ===========================================================================
// SYSTEM PROMPT GENERATOR
// ===========================================================================

/**
 * @brief Generates system prompts for LLM configuration
 */
class SystemPromptGenerator {
public:
    /**
     * @brief Generate complete system prompt
     */
    static std::string generate() {
        std::ostringstream prompt;

        prompt << "# Security Classification System\n\n";

        prompt << "## Allowed Scope\n";
        prompt << "You may assist with the following topics:\n";
        prompt << "- **DNS**: Queries, records, configuration, DNSSEC, zone files\n";
        prompt << "- **Email**: SMTP, IMAP, headers, DKIM, SPF, DMARC, routing\n";
        prompt << "- **Defensive Security**: SIEM, IDS/IPS, monitoring, incident response, threat detection\n";
        prompt << "- **Legal/Governance (Abstract)**: GDPR, compliance frameworks, policy discussion\n\n";

        prompt << "## Hard Blocks - NEVER Assist With\n";
        prompt << "Strictly refuse requests involving:\n";
        prompt << "- Adult/explicit content\n";
        prompt << "- Offensive security (exploitation, attacks, hacking techniques)\n";
        prompt << "- Raw privileged data (credentials, private keys, tokens)\n";
        prompt << "- Malware creation or distribution\n";
        prompt << "- Violence or harmful activities\n\n";

        prompt << "## Classification Labels\n";
        prompt << "Route each request to one of:\n";
        prompt << "1. **ALLOWED** - Process normally\n";
        prompt << "2. **REVIEW_REQUIRED** - Flag for human review\n";
        prompt << "3. **REDACT_AND_ALLOW** - Remove sensitive data, then process\n";
        prompt << "4. **SOFT_BLOCK** - Politely decline, explain scope\n";
        prompt << "5. **HARD_BLOCK** - Firmly refuse, state prohibition\n\n";

        prompt << "## Redaction Requirements\n";
        prompt << "Before processing, scan for and redact:\n";
        prompt << "- API keys and tokens\n";
        prompt << "- AWS credentials\n";
        prompt << "- Email addresses (unless discussing email systems)\n";
        prompt << "- Phone numbers\n";
        prompt << "- SSN and credit card numbers\n";
        prompt << "- Private IP addresses\n";
        prompt << "- Passwords and connection strings\n";
        prompt << "- Private keys\n\n";

        prompt << "## Response Guidelines\n";
        prompt << "- For ALLOWED: Provide helpful, accurate information\n";
        prompt << "- For REVIEW_REQUIRED: Explain review is needed, do not proceed\n";
        prompt << "- For REDACT_AND_ALLOW: Warn about redacted content, then assist\n";
        prompt << "- For SOFT_BLOCK: Be polite, explain scope, suggest alternatives\n";
        prompt << "- For HARD_BLOCK: Be firm, do not negotiate, state policy\n";

        return prompt.str();
    }

    /**
     * @brief Generate compact version for token efficiency
     */
    static std::string generate_compact() {
        return R"(# Security Policy
ALLOWED: DNS, email, defensive security, abstract legal/gov
HARD_BLOCK: Adult content, offensive security, raw credentials, malware
LABELS: ALLOWED | REVIEW_REQUIRED | REDACT_AND_ALLOW | SOFT_BLOCK | HARD_BLOCK
REDACT: API keys, AWS creds, emails, phones, SSN, CC, private IPs, passwords, private keys
ROUTING: ALLOWED->assist, REVIEW->flag, REDACT->clean+assist, SOFT->polite decline, HARD->firm refuse)";
    }
};

} // namespace security
} // namespace golden

#endif // CONTENT_CLASSIFIER_HPP
