/**
 * @file agent_guardrails.hpp
 * @brief Agent Guardrails System for Golden Ratio Containers
 *
 * Provides safety constraints, validation, and boundary enforcement:
 *   - Value range validation
 *   - Capacity limits
 *   - Golden ratio invariant enforcement
 *   - Operation rate limiting
 *   - Type safety guards
 */

#ifndef AGENT_GUARDRAILS_HPP
#define AGENT_GUARDRAILS_HPP

#include "phi_math.hpp"
#include <functional>
#include <string>
#include <vector>
#include <optional>
#include <stdexcept>
#include <chrono>
#include <limits>
#include <type_traits>
#include <mutex>
#include <atomic>

namespace golden {
namespace guardrails {

// ===========================================================================
// VALIDATION RESULT
// ===========================================================================

/**
 * @brief Result of a guardrail validation check
 */
struct ValidationResult {
    bool valid;
    std::string message;
    std::string guardrail_name;
    int severity;  // 0=info, 1=warning, 2=error, 3=critical

    static ValidationResult ok() {
        return {true, "", "", 0};
    }

    static ValidationResult error(const std::string& msg, const std::string& guard = "", int sev = 2) {
        return {false, msg, guard, sev};
    }

    static ValidationResult warning(const std::string& msg, const std::string& guard = "") {
        return {true, msg, guard, 1};
    }

    explicit operator bool() const { return valid; }
};

// ===========================================================================
// GUARDRAIL BASE CLASS
// ===========================================================================

/**
 * @brief Base class for all guardrails
 */
template<typename T>
class IGuardrail {
public:
    virtual ~IGuardrail() = default;

    /**
     * @brief Validate a value against this guardrail
     * @param value Value to validate
     * @return Validation result
     */
    virtual ValidationResult validate(const T& value) const = 0;

    /**
     * @brief Get guardrail name
     */
    virtual std::string name() const = 0;

    /**
     * @brief Check if guardrail is enabled
     */
    virtual bool is_enabled() const { return true; }

    /**
     * @brief Enable or disable guardrail
     */
    virtual void set_enabled(bool enabled) {}
};

// ===========================================================================
// VALUE RANGE GUARDRAILS
// ===========================================================================

/**
 * @brief Ensures values are within a specified range
 */
template<typename T>
class RangeGuardrail : public IGuardrail<T> {
    T min_value_;
    T max_value_;
    bool enabled_ = true;

public:
    RangeGuardrail(T min_val, T max_val)
        : min_value_(min_val), max_value_(max_val) {}

    ValidationResult validate(const T& value) const override {
        if (!enabled_) return ValidationResult::ok();

        if (value < min_value_) {
            return ValidationResult::error(
                "Value " + std::to_string(value) + " below minimum " + std::to_string(min_value_),
                name());
        }
        if (value > max_value_) {
            return ValidationResult::error(
                "Value " + std::to_string(value) + " above maximum " + std::to_string(max_value_),
                name());
        }
        return ValidationResult::ok();
    }

    std::string name() const override { return "RangeGuardrail"; }
    bool is_enabled() const override { return enabled_; }
    void set_enabled(bool enabled) override { enabled_ = enabled; }

    void set_range(T min_val, T max_val) {
        min_value_ = min_val;
        max_value_ = max_val;
    }
};

/**
 * @brief Ensures values are positive (> 0)
 */
template<typename T>
class PositiveGuardrail : public IGuardrail<T> {
    bool allow_zero_ = false;

public:
    explicit PositiveGuardrail(bool allow_zero = false) : allow_zero_(allow_zero) {}

    ValidationResult validate(const T& value) const override {
        if (allow_zero_ && value >= 0) return ValidationResult::ok();
        if (!allow_zero_ && value > 0) return ValidationResult::ok();

        return ValidationResult::error(
            "Value must be " + std::string(allow_zero_ ? "non-negative" : "positive"),
            name());
    }

    std::string name() const override { return "PositiveGuardrail"; }
};

// ===========================================================================
// GOLDEN RATIO INVARIANT GUARDRAILS
// ===========================================================================

/**
 * @brief Ensures golden ratio relationships are maintained
 */
template<typename T>
class GoldenRatioGuardrail : public IGuardrail<T> {
    double tolerance_;
    T reference_value_;
    bool has_reference_ = false;

public:
    explicit GoldenRatioGuardrail(double tolerance = 0.01)
        : tolerance_(tolerance) {}

    void set_reference(T ref) {
        reference_value_ = ref;
        has_reference_ = true;
    }

    ValidationResult validate(const T& value) const override {
        if (!has_reference_) return ValidationResult::ok();

        double expected = static_cast<double>(reference_value_) * PhiConstants::PHI;
        double actual = static_cast<double>(value);
        double deviation = std::abs(actual - expected) / expected;

        if (deviation > tolerance_) {
            return ValidationResult::error(
                "Value deviates " + std::to_string(deviation * 100) +
                "% from golden ratio (tolerance: " + std::to_string(tolerance_ * 100) + "%)",
                name());
        }
        return ValidationResult::ok();
    }

    std::string name() const override { return "GoldenRatioGuardrail"; }
};

/**
 * @brief Validates Fibonacci sequence membership
 */
template<typename T>
class FibonacciGuardrail : public IGuardrail<T> {
public:
    ValidationResult validate(const T& value) const override {
        if (!golden::is_fibonacci(value)) {
            return ValidationResult::error(
                "Value " + std::to_string(value) + " is not a Fibonacci number",
                name());
        }
        return ValidationResult::ok();
    }

    std::string name() const override { return "FibonacciGuardrail"; }
};

// ===========================================================================
// CAPACITY AND SIZE GUARDRAILS
// ===========================================================================

/**
 * @brief Limits container capacity
 */
class CapacityGuardrail : public IGuardrail<size_t> {
    size_t max_capacity_;
    size_t warning_threshold_;

public:
    explicit CapacityGuardrail(size_t max_cap, size_t warn_threshold = 0)
        : max_capacity_(max_cap)
        , warning_threshold_(warn_threshold > 0 ? warn_threshold : max_cap * 0.8) {}

    ValidationResult validate(const size_t& size) const override {
        if (size > max_capacity_) {
            return ValidationResult::error(
                "Capacity " + std::to_string(size) + " exceeds maximum " + std::to_string(max_capacity_),
                name(), 3);  // Critical
        }
        if (size > warning_threshold_) {
            return ValidationResult::warning(
                "Capacity " + std::to_string(size) + " approaching limit " + std::to_string(max_capacity_),
                name());
        }
        return ValidationResult::ok();
    }

    std::string name() const override { return "CapacityGuardrail"; }
};

/**
 * @brief Ensures container maintains golden-ratio based capacity
 */
class GoldenCapacityGuardrail : public IGuardrail<size_t> {
    size_t base_capacity_;

public:
    explicit GoldenCapacityGuardrail(size_t base = 1) : base_capacity_(base) {}

    ValidationResult validate(const size_t& capacity) const override {
        // Check if capacity follows fibonacci sequence (golden ratio property)
        size_t current = base_capacity_;
        size_t prev = 0;

        while (current < capacity) {
            size_t next = current + prev;
            prev = current;
            current = next;
        }

        if (current != capacity && prev != capacity && capacity != base_capacity_) {
            return ValidationResult::warning(
                "Capacity " + std::to_string(capacity) +
                " doesn't follow Fibonacci growth. Suggested: " + std::to_string(current),
                name());
        }
        return ValidationResult::ok();
    }

    std::string name() const override { return "GoldenCapacityGuardrail"; }
};

// ===========================================================================
// RATE LIMITING GUARDRAIL
// ===========================================================================

/**
 * @brief Limits operation frequency (operations per time window)
 */
class RateLimitGuardrail : public IGuardrail<int> {
    size_t max_operations_;
    std::chrono::milliseconds window_;
    mutable std::atomic<size_t> operation_count_{0};
    mutable std::chrono::steady_clock::time_point window_start_;
    mutable std::mutex mutex_;

public:
    RateLimitGuardrail(size_t max_ops, std::chrono::milliseconds window)
        : max_operations_(max_ops)
        , window_(window)
        , window_start_(std::chrono::steady_clock::now()) {}

    ValidationResult validate(const int& /* unused */) const override {
        std::lock_guard<std::mutex> lock(mutex_);

        auto now = std::chrono::steady_clock::now();
        auto elapsed = std::chrono::duration_cast<std::chrono::milliseconds>(now - window_start_);

        // Reset window if expired
        if (elapsed >= window_) {
            window_start_ = now;
            operation_count_ = 1;
            return ValidationResult::ok();
        }

        // Check rate limit
        if (operation_count_ >= max_operations_) {
            return ValidationResult::error(
                "Rate limit exceeded: " + std::to_string(max_operations_) +
                " ops per " + std::to_string(window_.count()) + "ms",
                name(), 2);
        }

        operation_count_++;
        return ValidationResult::ok();
    }

    std::string name() const override { return "RateLimitGuardrail"; }

    void reset() {
        std::lock_guard<std::mutex> lock(mutex_);
        operation_count_ = 0;
        window_start_ = std::chrono::steady_clock::now();
    }
};

// ===========================================================================
// GUARDRAIL CHAIN (COMPOSITE PATTERN)
// ===========================================================================

/**
 * @brief Chains multiple guardrails together
 *
 * All guardrails in the chain are evaluated. The chain fails if any
 * guardrail fails (AND logic).
 */
template<typename T>
class GuardrailChain {
    std::vector<std::shared_ptr<IGuardrail<T>>> guardrails_;
    bool fail_fast_ = true;  // Stop on first failure

public:
    GuardrailChain& add(std::shared_ptr<IGuardrail<T>> guardrail) {
        guardrails_.push_back(std::move(guardrail));
        return *this;
    }

    template<typename G, typename... Args>
    GuardrailChain& add(Args&&... args) {
        guardrails_.push_back(std::make_shared<G>(std::forward<Args>(args)...));
        return *this;
    }

    void set_fail_fast(bool fail_fast) { fail_fast_ = fail_fast; }

    /**
     * @brief Validate value against all guardrails
     * @return First failure result, or ok if all pass
     */
    ValidationResult validate(const T& value) const {
        std::vector<ValidationResult> failures;

        for (const auto& guardrail : guardrails_) {
            if (!guardrail->is_enabled()) continue;

            auto result = guardrail->validate(value);
            if (!result) {
                if (fail_fast_) {
                    return result;
                }
                failures.push_back(result);
            }
        }

        if (!failures.empty()) {
            // Combine all failure messages
            std::string combined = "Multiple guardrail failures: ";
            for (const auto& f : failures) {
                combined += "[" + f.guardrail_name + ": " + f.message + "] ";
            }
            return ValidationResult::error(combined, "GuardrailChain", 3);
        }

        return ValidationResult::ok();
    }

    /**
     * @brief Check value and throw if invalid
     */
    void enforce(const T& value) const {
        auto result = validate(value);
        if (!result) {
            throw std::runtime_error("Guardrail violation: " + result.message);
        }
    }

    /**
     * @brief Check value and return sanitized result if invalid
     */
    T validate_or_default(const T& value, const T& default_value) const {
        return validate(value) ? value : default_value;
    }

    size_t size() const { return guardrails_.size(); }
    bool empty() const { return guardrails_.empty(); }

    void clear() { guardrails_.clear(); }
};

// ===========================================================================
// AGENT BOUNDARY ENFORCER
// ===========================================================================

/**
 * @brief High-level agent guardrail system
 *
 * Provides comprehensive boundary enforcement for agents interacting
 * with golden ratio containers.
 */
template<typename T>
class AgentBoundaryEnforcer {
public:
    enum class Action { INSERT, REMOVE, UPDATE, RESIZE, QUERY };
    enum class Response { ALLOW, DENY, WARN, MODIFY };

    using ActionHandler = std::function<Response(Action, const T&)>;

private:
    GuardrailChain<T> value_guardrails_;
    GuardrailChain<size_t> size_guardrails_;
    std::unordered_map<Action, bool> allowed_actions_;
    ActionHandler custom_handler_;
    size_t violation_count_ = 0;
    size_t max_violations_ = 100;
    bool locked_ = false;

public:
    AgentBoundaryEnforcer() {
        // All actions allowed by default
        allowed_actions_[Action::INSERT] = true;
        allowed_actions_[Action::REMOVE] = true;
        allowed_actions_[Action::UPDATE] = true;
        allowed_actions_[Action::RESIZE] = true;
        allowed_actions_[Action::QUERY] = true;
    }

    // Configuration
    AgentBoundaryEnforcer& allow(Action action, bool allowed = true) {
        allowed_actions_[action] = allowed;
        return *this;
    }

    AgentBoundaryEnforcer& deny(Action action) {
        return allow(action, false);
    }

    AgentBoundaryEnforcer& set_max_violations(size_t max) {
        max_violations_ = max;
        return *this;
    }

    AgentBoundaryEnforcer& set_custom_handler(ActionHandler handler) {
        custom_handler_ = std::move(handler);
        return *this;
    }

    // Guardrail chain access
    GuardrailChain<T>& value_guardrails() { return value_guardrails_; }
    GuardrailChain<size_t>& size_guardrails() { return size_guardrails_; }

    // Enforcement
    Response check_action(Action action, const T& value) {
        if (locked_) {
            return Response::DENY;
        }

        // Check if action is allowed
        auto it = allowed_actions_.find(action);
        if (it == allowed_actions_.end() || !it->second) {
            record_violation();
            return Response::DENY;
        }

        // Custom handler takes precedence
        if (custom_handler_) {
            return custom_handler_(action, value);
        }

        // Value guardrails
        auto result = value_guardrails_.validate(value);
        if (!result) {
            record_violation();
            return result.severity >= 2 ? Response::DENY : Response::WARN;
        }

        return Response::ALLOW;
    }

    Response check_size(size_t size) {
        if (locked_) {
            return Response::DENY;
        }

        auto result = size_guardrails_.validate(size);
        if (!result) {
            record_violation();
            return result.severity >= 2 ? Response::DENY : Response::WARN;
        }

        return Response::ALLOW;
    }

    // Lock mechanism (permanent deny after too many violations)
    bool is_locked() const { return locked_; }
    size_t violation_count() const { return violation_count_; }

    void reset_violations() {
        violation_count_ = 0;
        locked_ = false;
    }

private:
    void record_violation() {
        violation_count_++;
        if (violation_count_ >= max_violations_) {
            locked_ = true;
        }
    }
};

// ===========================================================================
// FACTORY FOR COMMON GUARDRAIL CONFIGURATIONS
// ===========================================================================

/**
 * @brief Factory for creating pre-configured guardrail chains
 */
template<typename T>
class GuardrailFactory {
public:
    /**
     * @brief Create guardrails for Fibonacci container
     */
    static GuardrailChain<T> fibonacci_chain() {
        GuardrailChain<T> chain;
        chain.template add<PositiveGuardrail<T>>(true);
        chain.template add<FibonacciGuardrail<T>>();
        return chain;
    }

    /**
     * @brief Create guardrails for golden ratio container
     */
    static GuardrailChain<T> golden_ratio_chain(T min_val = 0, T max_val = std::numeric_limits<T>::max()) {
        GuardrailChain<T> chain;
        chain.template add<RangeGuardrail<T>>(min_val, max_val);
        chain.template add<GoldenRatioGuardrail<T>>(0.05);  // 5% tolerance
        return chain;
    }

    /**
     * @brief Create capacity guardrails
     */
    static GuardrailChain<size_t> capacity_chain(size_t max_cap) {
        GuardrailChain<size_t> chain;
        chain.template add<CapacityGuardrail>(max_cap);
        chain.template add<GoldenCapacityGuardrail>();
        return chain;
    }

    /**
     * @brief Create comprehensive agent boundary enforcer
     */
    static AgentBoundaryEnforcer<T> create_enforcer(
        T min_val, T max_val,
        size_t max_capacity,
        size_t max_violations = 100
    ) {
        AgentBoundaryEnforcer<T> enforcer;

        enforcer.value_guardrails()
            .template add<PositiveGuardrail<T>>(true)
            .template add<RangeGuardrail<T>>(min_val, max_val);

        enforcer.size_guardrails()
            .template add<CapacityGuardrail>(max_capacity)
            .template add<GoldenCapacityGuardrail>();

        enforcer.set_max_violations(max_violations);

        return enforcer;
    }
};

} // namespace guardrails
} // namespace golden

#endif // AGENT_GUARDRAILS_HPP
