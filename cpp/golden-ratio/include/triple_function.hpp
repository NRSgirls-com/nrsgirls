/**
 * @file triple_function.hpp
 * @brief Synthesized Triple Function with Layover Position Reinforcement
 *
 * Implements a triple-function synthesis system that:
 *   - Combines three functions (phi-weighted)
 *   - Reinforces intermediate "layover" positions
 *   - Uses golden ratio for optimal weighting
 *   - Provides state transition via Fibonacci stepping
 *
 * The Triple Function Synthesis:
 *   F(x) = w1*f1(x) + w2*f2(x) + w3*f3(x)
 *   where w1:w2:w3 follows golden ratio proportions
 *
 * Layover Reinforcement:
 *   Intermediate states are reinforced using feedback loops
 *   weighted by phi^n for the nth reinforcement iteration.
 */

#ifndef TRIPLE_FUNCTION_HPP
#define TRIPLE_FUNCTION_HPP

#include "phi_math.hpp"
#include "observer_system.hpp"
#include "agent_guardrails.hpp"
#include <functional>
#include <array>
#include <vector>
#include <deque>
#include <optional>
#include <memory>
#include <cmath>

namespace golden {
namespace synthesis {

// ===========================================================================
// TRIPLE FUNCTION WEIGHT SCHEMES
// ===========================================================================

/**
 * @brief Weight distribution schemes for triple function synthesis
 */
enum class WeightScheme {
    GOLDEN_HARMONIC,    // [1/φ², 1/φ, 1] normalized
    FIBONACCI_TRIPLE,   // [1, 1, 2] / 4 (Fibonacci ratios)
    PHI_POWER,          // [1, φ, φ²] normalized
    EQUAL,              // [1/3, 1/3, 1/3]
    CUSTOM              // User-defined
};

/**
 * @brief Calculate weights for a given scheme
 */
inline std::array<double, 3> get_weights(WeightScheme scheme) {
    switch (scheme) {
        case WeightScheme::GOLDEN_HARMONIC: {
            double phi_sq_inv = 1.0 / PhiConstants::PHI_SQUARED;
            double phi_inv = PhiConstants::PHI_RECIPROCAL;
            double sum = phi_sq_inv + phi_inv + 1.0;
            return {phi_sq_inv / sum, phi_inv / sum, 1.0 / sum};
        }
        case WeightScheme::FIBONACCI_TRIPLE: {
            return {0.25, 0.25, 0.5};  // 1:1:2 normalized
        }
        case WeightScheme::PHI_POWER: {
            double sum = 1.0 + PhiConstants::PHI + PhiConstants::PHI_SQUARED;
            return {1.0 / sum, PhiConstants::PHI / sum, PhiConstants::PHI_SQUARED / sum};
        }
        case WeightScheme::EQUAL:
        default:
            return {1.0/3.0, 1.0/3.0, 1.0/3.0};
    }
}

// ===========================================================================
// LAYOVER POSITION STATE
// ===========================================================================

/**
 * @brief Represents a layover position in the synthesis process
 *
 * A layover is an intermediate state that can be reinforced
 * through feedback loops.
 */
template<typename T>
struct LayoverPosition {
    T value;                    // Current value
    T previous_value;           // Value before reinforcement
    double reinforcement_strength;  // Accumulated reinforcement (phi-weighted)
    size_t iteration_count;     // Number of reinforcement iterations
    double phi_factor;          // Current phi^n factor

    LayoverPosition(T val = T{})
        : value(val)
        , previous_value(val)
        , reinforcement_strength(1.0)
        , iteration_count(0)
        , phi_factor(1.0) {}

    /**
     * @brief Apply reinforcement using golden ratio scaling
     */
    void reinforce() {
        previous_value = value;
        iteration_count++;
        phi_factor *= PhiConstants::PHI;
        reinforcement_strength = phi_factor;
    }

    /**
     * @brief Calculate stability metric (ratio of value to reinforcement)
     */
    double stability() const {
        if (reinforcement_strength == 0) return 0;
        return static_cast<double>(value) / reinforcement_strength;
    }
};

// ===========================================================================
// TRIPLE FUNCTION SYNTHESIZER
// ===========================================================================

/**
 * @brief Synthesizes three functions with golden ratio weighting
 *
 * @tparam T Input/output type
 */
template<typename T>
class TripleFunctionSynthesizer {
public:
    using Function = std::function<T(T)>;
    using WeightedResult = std::pair<T, std::array<double, 3>>;

private:
    std::array<Function, 3> functions_;
    std::array<double, 3> weights_;
    WeightScheme scheme_;
    bool functions_set_ = false;

public:
    TripleFunctionSynthesizer(WeightScheme scheme = WeightScheme::GOLDEN_HARMONIC)
        : scheme_(scheme), weights_(get_weights(scheme)) {}

    /**
     * @brief Set the three functions to synthesize
     */
    void set_functions(Function f1, Function f2, Function f3) {
        functions_[0] = std::move(f1);
        functions_[1] = std::move(f2);
        functions_[2] = std::move(f3);
        functions_set_ = true;
    }

    /**
     * @brief Set custom weights
     */
    void set_weights(double w1, double w2, double w3) {
        double sum = w1 + w2 + w3;
        weights_ = {w1/sum, w2/sum, w3/sum};
        scheme_ = WeightScheme::CUSTOM;
    }

    /**
     * @brief Change weight scheme
     */
    void set_scheme(WeightScheme scheme) {
        scheme_ = scheme;
        weights_ = get_weights(scheme);
    }

    /**
     * @brief Synthesize: Apply all three functions and combine with weights
     */
    T synthesize(T input) const {
        if (!functions_set_) {
            throw std::runtime_error("Functions not set for synthesis");
        }

        T result = T{};
        for (size_t i = 0; i < 3; ++i) {
            if (functions_[i]) {
                result += static_cast<T>(weights_[i] * static_cast<double>(functions_[i](input)));
            }
        }
        return result;
    }

    /**
     * @brief Synthesize with detailed result
     */
    WeightedResult synthesize_detailed(T input) const {
        if (!functions_set_) {
            throw std::runtime_error("Functions not set for synthesis");
        }

        std::array<double, 3> contributions;
        T result = T{};

        for (size_t i = 0; i < 3; ++i) {
            if (functions_[i]) {
                double contrib = weights_[i] * static_cast<double>(functions_[i](input));
                contributions[i] = contrib;
                result += static_cast<T>(contrib);
            } else {
                contributions[i] = 0;
            }
        }

        return {result, contributions};
    }

    /**
     * @brief Get individual function output
     */
    std::optional<T> apply_function(size_t index, T input) const {
        if (index >= 3 || !functions_[index]) return std::nullopt;
        return functions_[index](input);
    }

    const std::array<double, 3>& weights() const { return weights_; }
    WeightScheme scheme() const { return scheme_; }
};

// ===========================================================================
// LAYOVER REINFORCEMENT ENGINE
// ===========================================================================

/**
 * @brief Engine for reinforcing layover positions with triple function synthesis
 *
 * Combines the synthesizer with layover state management and feedback loops.
 */
template<typename T>
class LayoverReinforcementEngine : public obs::Observable<LayoverPosition<T>> {
public:
    using Synthesizer = TripleFunctionSynthesizer<T>;
    using Position = LayoverPosition<T>;
    using PositionHistory = std::deque<Position>;

private:
    Synthesizer synthesizer_;
    Position current_position_;
    PositionHistory history_;
    size_t max_history_size_ = 100;
    guardrails::GuardrailChain<T> guardrails_;
    size_t reinforcement_iterations_ = 0;
    double convergence_threshold_ = 0.001;

public:
    explicit LayoverReinforcementEngine(WeightScheme scheme = WeightScheme::GOLDEN_HARMONIC)
        : obs::Observable<Position>("LayoverReinforcementEngine")
        , synthesizer_(scheme) {}

    // Configuration
    Synthesizer& synthesizer() { return synthesizer_; }
    guardrails::GuardrailChain<T>& guardrails() { return guardrails_; }

    void set_max_history(size_t size) { max_history_size_ = size; }
    void set_convergence_threshold(double threshold) { convergence_threshold_ = threshold; }

    /**
     * @brief Initialize with a starting value
     */
    void initialize(T initial_value) {
        current_position_ = Position(initial_value);
        history_.clear();
        reinforcement_iterations_ = 0;
        record_position();
    }

    /**
     * @brief Apply one reinforcement iteration
     *
     * Uses the triple function synthesis to transform the current value,
     * then reinforces the layover position.
     */
    Position reinforce_once() {
        // Validate current value
        auto validation = guardrails_.validate(current_position_.value);
        if (!validation) {
            // Emit warning event but continue
            obs::ContainerEvent<Position> event(obs::EventType::CUSTOM);
            event.custom_data = "Guardrail warning: " + validation.message;
            this->notify(event);
        }

        // Apply synthesis
        T new_value = synthesizer_.synthesize(current_position_.value);

        // Update position
        current_position_.value = new_value;
        current_position_.reinforce();

        // Record in history
        record_position();

        // Emit reinforcement event
        obs::ContainerEvent<Position> event(obs::EventType::UPDATE);
        event.new_value = current_position_;
        event.phi_ratio = current_position_.phi_factor;
        this->notify(event);

        reinforcement_iterations_++;
        return current_position_;
    }

    /**
     * @brief Reinforce until convergence or max iterations
     *
     * @param max_iterations Maximum number of iterations
     * @return Final position after convergence
     */
    Position reinforce_until_convergence(size_t max_iterations = 100) {
        for (size_t i = 0; i < max_iterations; ++i) {
            T prev_value = current_position_.value;
            reinforce_once();

            // Check for convergence
            double change = std::abs(static_cast<double>(current_position_.value) -
                                      static_cast<double>(prev_value));
            double relative_change = (prev_value != T{}) ?
                change / std::abs(static_cast<double>(prev_value)) : change;

            if (relative_change < convergence_threshold_) {
                obs::ContainerEvent<Position> event(obs::EventType::REBALANCE);
                event.custom_data = "Converged after " + std::to_string(i + 1) + " iterations";
                this->notify(event);
                break;
            }
        }
        return current_position_;
    }

    /**
     * @brief Reinforce with Fibonacci-stepping iterations
     *
     * Performs F(n) reinforcement iterations for increasing Fibonacci numbers.
     */
    Position reinforce_fibonacci_steps(size_t fib_index) {
        size_t iterations = fibonacci_binet<size_t>(fib_index);
        for (size_t i = 0; i < iterations; ++i) {
            reinforce_once();
        }
        return current_position_;
    }

    // Accessors
    const Position& current() const { return current_position_; }
    const PositionHistory& history() const { return history_; }
    size_t iteration_count() const { return reinforcement_iterations_; }

    /**
     * @brief Calculate trajectory stability
     *
     * Measures how stable the reinforcement trajectory has been.
     */
    double trajectory_stability() const {
        if (history_.size() < 2) return 1.0;

        double variance = 0.0;
        double mean = 0.0;

        for (const auto& pos : history_) {
            mean += static_cast<double>(pos.value);
        }
        mean /= history_.size();

        for (const auto& pos : history_) {
            double diff = static_cast<double>(pos.value) - mean;
            variance += diff * diff;
        }
        variance /= history_.size();

        // Return stability as inverse of coefficient of variation
        double std_dev = std::sqrt(variance);
        return (mean != 0) ? mean / std_dev : 0;
    }

    /**
     * @brief Get golden-ratio interpolated position from history
     *
     * Returns the position at the golden section point of the history.
     */
    Position golden_interpolated_position() const {
        if (history_.empty()) return current_position_;
        if (history_.size() == 1) return history_.front();

        size_t index = static_cast<size_t>(history_.size() * PhiConstants::PHI_RECIPROCAL);
        return history_[index];
    }

private:
    void record_position() {
        history_.push_back(current_position_);
        while (history_.size() > max_history_size_) {
            history_.pop_front();
        }
    }
};

// ===========================================================================
// TRIPLE FUNCTION PRESETS
// ===========================================================================

/**
 * @brief Factory for common triple function combinations
 */
template<typename T>
class TripleFunctionPresets {
public:
    using Function = typename TripleFunctionSynthesizer<T>::Function;

    /**
     * @brief Golden scaling functions
     *
     * f1(x) = x * φ^-1 (contract)
     * f2(x) = x        (identity)
     * f3(x) = x * φ    (expand)
     */
    static std::array<Function, 3> golden_scaling() {
        return {
            [](T x) -> T { return static_cast<T>(x * PhiConstants::PHI_RECIPROCAL); },
            [](T x) -> T { return x; },
            [](T x) -> T { return static_cast<T>(x * PhiConstants::PHI); }
        };
    }

    /**
     * @brief Fibonacci step functions
     *
     * f1(x) = x
     * f2(x) = x + previous (simulated)
     * f3(x) = x + x = 2x
     */
    static std::array<Function, 3> fibonacci_step() {
        return {
            [](T x) -> T { return x; },
            [](T x) -> T { return static_cast<T>(x * PhiConstants::PHI); },  // Approximate next Fib
            [](T x) -> T { return x * 2; }
        };
    }

    /**
     * @brief Damped oscillation around golden ratio
     *
     * f1(x) = x * (1 - 1/φ²)  (undershoot)
     * f2(x) = x               (center)
     * f3(x) = x * (1 + 1/φ²)  (overshoot)
     */
    static std::array<Function, 3> golden_oscillation() {
        double damping = 1.0 / PhiConstants::PHI_SQUARED;
        return {
            [damping](T x) -> T { return static_cast<T>(x * (1.0 - damping)); },
            [](T x) -> T { return x; },
            [damping](T x) -> T { return static_cast<T>(x * (1.0 + damping)); }
        };
    }

    /**
     * @brief Convergent golden mean functions
     *
     * All three functions push toward a golden-ratio balanced mean.
     */
    static std::array<Function, 3> convergent_mean() {
        return {
            [](T x) -> T {
                return static_cast<T>((x + x * PhiConstants::PHI_RECIPROCAL) / 2.0);
            },
            [](T x) -> T {
                return x;
            },
            [](T x) -> T {
                return static_cast<T>((x + x * PhiConstants::PHI) / 2.0);
            }
        };
    }

    /**
     * @brief Apply preset to synthesizer
     */
    static void apply_preset(TripleFunctionSynthesizer<T>& synth,
                             const std::array<Function, 3>& preset) {
        synth.set_functions(preset[0], preset[1], preset[2]);
    }
};

// ===========================================================================
// REINFORCEMENT STRATEGIES
// ===========================================================================

/**
 * @brief Different strategies for applying reinforcement
 */
enum class ReinforcementStrategy {
    LINEAR,             // Apply reinforcement linearly
    FIBONACCI_DECAY,    // Decrease by Fibonacci ratios
    PHI_EXPONENTIAL,    // Exponential decay by φ^-n
    ADAPTIVE           // Adapt based on convergence
};

/**
 * @brief Strategy-based reinforcement controller
 */
template<typename T>
class ReinforcementController {
    LayoverReinforcementEngine<T>& engine_;
    ReinforcementStrategy strategy_;
    double strategy_parameter_ = 1.0;

public:
    ReinforcementController(LayoverReinforcementEngine<T>& engine,
                            ReinforcementStrategy strategy = ReinforcementStrategy::LINEAR)
        : engine_(engine), strategy_(strategy) {}

    void set_strategy(ReinforcementStrategy strategy) { strategy_ = strategy; }
    void set_parameter(double param) { strategy_parameter_ = param; }

    /**
     * @brief Execute reinforcement according to strategy
     */
    LayoverPosition<T> execute(size_t iterations) {
        switch (strategy_) {
            case ReinforcementStrategy::FIBONACCI_DECAY:
                return execute_fibonacci_decay(iterations);
            case ReinforcementStrategy::PHI_EXPONENTIAL:
                return execute_phi_exponential(iterations);
            case ReinforcementStrategy::ADAPTIVE:
                return engine_.reinforce_until_convergence(iterations);
            case ReinforcementStrategy::LINEAR:
            default:
                for (size_t i = 0; i < iterations; ++i) {
                    engine_.reinforce_once();
                }
                return engine_.current();
        }
    }

private:
    LayoverPosition<T> execute_fibonacci_decay(size_t iterations) {
        for (size_t i = 0; i < iterations; ++i) {
            // Weight decreases by Fibonacci ratio
            double weight = 1.0 / fibonacci_binet<double>(i + 2);
            engine_.synthesizer().set_weights(
                weight / PhiConstants::PHI_SQUARED,
                weight / PhiConstants::PHI,
                weight
            );
            engine_.reinforce_once();
        }
        return engine_.current();
    }

    LayoverPosition<T> execute_phi_exponential(size_t iterations) {
        for (size_t i = 0; i < iterations; ++i) {
            // Exponential decay by φ^-i
            double decay = std::pow(PhiConstants::PHI_RECIPROCAL, static_cast<double>(i));
            engine_.synthesizer().set_weights(
                decay * 0.2,
                decay * 0.3,
                decay * 0.5
            );
            engine_.reinforce_once();
        }
        return engine_.current();
    }
};

} // namespace synthesis
} // namespace golden

#endif // TRIPLE_FUNCTION_HPP
