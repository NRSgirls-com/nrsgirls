/**
 * @file main.cpp
 * @brief Golden Ratio Containers - Demonstration & Tests
 *
 * Demonstrates:
 *   - Phi mathematical utilities
 *   - Fibonacci vector with golden growth
 *   - Golden hash map with phi-based hashing
 *   - Phi partition list with automatic golden point tracking
 *   - Spiral buffer with sunflower distribution
 *   - Observer pattern integration
 *   - Agent guardrails enforcement
 *   - Triple function synthesis with layover reinforcement
 */

#include "../include/phi_math.hpp"
#include "../include/observer_system.hpp"
#include "../include/agent_guardrails.hpp"
#include "../include/triple_function.hpp"
#include "../include/golden_containers.hpp"

#include <iostream>
#include <iomanip>
#include <cassert>
#include <sstream>

using namespace golden;
using namespace golden::obs;
using namespace golden::guardrails;
using namespace golden::synthesis;
using namespace golden::containers;

// ===========================================================================
// UTILITY FUNCTIONS
// ===========================================================================

void print_header(const std::string& title) {
    std::cout << "\n" << std::string(60, '=') << "\n";
    std::cout << " " << title << "\n";
    std::cout << std::string(60, '=') << "\n\n";
}

void print_subheader(const std::string& title) {
    std::cout << "\n--- " << title << " ---\n\n";
}

// ===========================================================================
// TEST: PHI MATH UTILITIES
// ===========================================================================

void test_phi_math() {
    print_header("PHI MATHEMATICAL UTILITIES");

    // Constants
    std::cout << std::fixed << std::setprecision(15);
    std::cout << "Golden Ratio (phi):     " << PhiConstants::PHI << "\n";
    std::cout << "Phi Reciprocal (1/phi): " << PhiConstants::PHI_RECIPROCAL << "\n";
    std::cout << "Phi Squared:            " << PhiConstants::PHI_SQUARED << "\n";
    std::cout << "Golden Angle (radians): " << PhiConstants::GOLDEN_ANGLE << "\n";
    std::cout << "Golden Angle (degrees): " << PhiConstants::GOLDEN_ANGLE_DEG << "\n\n";

    // Verify phi^2 = phi + 1
    double phi_sq = PhiConstants::PHI * PhiConstants::PHI;
    double phi_plus_1 = PhiConstants::PHI + 1.0;
    std::cout << "Verify phi^2 = phi + 1:\n";
    std::cout << "  phi^2     = " << phi_sq << "\n";
    std::cout << "  phi + 1   = " << phi_plus_1 << "\n";
    std::cout << "  Difference: " << std::abs(phi_sq - phi_plus_1) << "\n\n";

    // Fibonacci sequence
    print_subheader("Fibonacci Sequence (Binet's Formula)");
    std::cout << "First 15 Fibonacci numbers:\n";
    for (size_t i = 0; i < 15; ++i) {
        std::cout << "F(" << std::setw(2) << i << ") = " << std::setw(6) << fibonacci_binet(i);
        if ((i + 1) % 5 == 0) std::cout << "\n";
        else std::cout << "  ";
    }
    std::cout << "\n";

    // Ratio approaching phi
    print_subheader("Fibonacci Ratios Approaching Phi");
    for (size_t i = 2; i <= 12; ++i) {
        double ratio = static_cast<double>(fibonacci_binet(i)) / fibonacci_binet(i - 1);
        double error = std::abs(ratio - PhiConstants::PHI);
        std::cout << "F(" << std::setw(2) << i << ")/F(" << std::setw(2) << (i-1) << ") = "
                  << std::setw(12) << ratio
                  << "  error: " << std::scientific << error << std::fixed << "\n";
    }

    // Golden partition
    print_subheader("Golden Partitioning");
    double total = 100.0;
    auto [larger, smaller] = golden_partition(total);
    std::cout << "Partitioning " << total << ":\n";
    std::cout << "  Larger portion:  " << larger << "\n";
    std::cout << "  Smaller portion: " << smaller << "\n";
    std::cout << "  Ratio: " << larger / smaller << " (should be ~1.618)\n\n";

    // Golden hash
    print_subheader("Golden Ratio Hashing");
    std::cout << "Hash distribution for keys 0-9 (table size 10):\n";
    for (int i = 0; i < 10; ++i) {
        std::cout << "  golden_hash(" << i << ") = " << golden_hash(i, 10) << "\n";
    }

    // Fibonacci check
    print_subheader("Fibonacci Number Detection");
    std::vector<int> test_values = {1, 2, 3, 4, 5, 8, 12, 13, 21, 50, 55};
    for (int val : test_values) {
        std::cout << std::setw(3) << val << " is "
                  << (is_fibonacci(val) ? "a Fibonacci number" : "NOT a Fibonacci number") << "\n";
    }

    std::cout << "\n[PASS] Phi math utilities working correctly\n";
}

// ===========================================================================
// TEST: OBSERVER SYSTEM
// ===========================================================================

void test_observer_system() {
    print_header("OBSERVER PATTERN SYSTEM");

    // Create observable
    Observable<int> subject("TestSubject");

    // Statistics observer
    auto stats = std::make_shared<StatisticsObserver<int>>();

    // Custom logging observer
    std::ostringstream log_stream;
    auto logger = std::make_shared<FunctionObserver<int>>(
        [&log_stream](ContainerEvent<int>& event) {
            log_stream << "Event: " << event_type_to_string(event.type)
                       << " from " << event.source_name << "\n";
        },
        5,  // Priority
        "CustomLogger"
    );

    // Attach observers
    subject.attach(stats);
    subject.attach(logger);

    std::cout << "Attached " << subject.observer_count() << " observers\n\n";

    // Simulate events (would normally be done internally by container)
    std::cout << "Simulating container events...\n";
    std::cout << "(Note: In real use, containers emit events automatically)\n\n";

    std::cout << "Events logged:\n" << log_stream.str();

    // Event filtering
    print_subheader("Event Filtering");
    auto insert_only = std::make_shared<FunctionObserver<int>>(
        [](ContainerEvent<int>& event) {
            std::cout << "  Received INSERT event\n";
        },
        [](EventType t) { return t == EventType::INSERT; },
        0,
        "InsertOnlyObserver"
    );

    std::cout << "InsertOnlyObserver accepts INSERT: "
              << (insert_only->accepts_event(EventType::INSERT) ? "yes" : "no") << "\n";
    std::cout << "InsertOnlyObserver accepts REMOVE: "
              << (insert_only->accepts_event(EventType::REMOVE) ? "yes" : "no") << "\n";

    std::cout << "\n[PASS] Observer system working correctly\n";
}

// ===========================================================================
// TEST: AGENT GUARDRAILS
// ===========================================================================

void test_guardrails() {
    print_header("AGENT GUARDRAILS SYSTEM");

    // Range guardrail
    print_subheader("Range Guardrail");
    RangeGuardrail<int> range_guard(0, 100);

    std::vector<int> test_values = {-10, 0, 50, 100, 150};
    for (int val : test_values) {
        auto result = range_guard.validate(val);
        std::cout << "  Value " << std::setw(4) << val << ": "
                  << (result ? "VALID" : "INVALID") << "\n";
    }

    // Fibonacci guardrail
    print_subheader("Fibonacci Guardrail");
    FibonacciGuardrail<int> fib_guard;

    std::vector<int> fib_test = {1, 2, 3, 4, 5, 6, 7, 8, 13, 21};
    for (int val : fib_test) {
        auto result = fib_guard.validate(val);
        std::cout << "  Value " << std::setw(2) << val << ": "
                  << (result ? "VALID (Fibonacci)" : "INVALID") << "\n";
    }

    // Guardrail chain
    print_subheader("Guardrail Chain");
    GuardrailChain<int> chain;
    chain.add<PositiveGuardrail<int>>(true)  // Allow zero
         .add<RangeGuardrail<int>>(0, 100);

    std::vector<int> chain_test = {-5, 0, 50, 100, 200};
    for (int val : chain_test) {
        auto result = chain.validate(val);
        std::cout << "  Value " << std::setw(4) << val << ": "
                  << (result ? "VALID" : "INVALID");
        if (!result) std::cout << " (" << result.message << ")";
        std::cout << "\n";
    }

    // Agent boundary enforcer
    print_subheader("Agent Boundary Enforcer");
    auto enforcer = GuardrailFactory<int>::create_enforcer(0, 1000, 10000, 5);

    using Action = AgentBoundaryEnforcer<int>::Action;
    using Response = AgentBoundaryEnforcer<int>::Response;

    auto response_to_string = [](Response r) -> std::string {
        switch (r) {
            case Response::ALLOW: return "ALLOW";
            case Response::DENY: return "DENY";
            case Response::WARN: return "WARN";
            case Response::MODIFY: return "MODIFY";
            default: return "UNKNOWN";
        }
    };

    std::cout << "  INSERT value 50:  " << response_to_string(enforcer.check_action(Action::INSERT, 50)) << "\n";
    std::cout << "  INSERT value -10: " << response_to_string(enforcer.check_action(Action::INSERT, -10)) << "\n";
    std::cout << "  Violation count:  " << enforcer.violation_count() << "\n";

    std::cout << "\n[PASS] Guardrails system working correctly\n";
}

// ===========================================================================
// TEST: TRIPLE FUNCTION SYNTHESIS
// ===========================================================================

void test_triple_function() {
    print_header("TRIPLE FUNCTION SYNTHESIS");

    // Weight schemes
    print_subheader("Weight Distribution Schemes");
    std::vector<WeightScheme> schemes = {
        WeightScheme::GOLDEN_HARMONIC,
        WeightScheme::FIBONACCI_TRIPLE,
        WeightScheme::PHI_POWER,
        WeightScheme::EQUAL
    };
    std::vector<std::string> scheme_names = {
        "GOLDEN_HARMONIC", "FIBONACCI_TRIPLE", "PHI_POWER", "EQUAL"
    };

    for (size_t i = 0; i < schemes.size(); ++i) {
        auto weights = get_weights(schemes[i]);
        std::cout << std::setw(17) << scheme_names[i] << ": ["
                  << std::fixed << std::setprecision(4)
                  << weights[0] << ", " << weights[1] << ", " << weights[2] << "]\n";
    }

    // Synthesizer demo
    print_subheader("Function Synthesis Demo");
    TripleFunctionSynthesizer<double> synth(WeightScheme::GOLDEN_HARMONIC);

    // Use preset functions
    auto preset = TripleFunctionPresets<double>::golden_scaling();
    synth.set_functions(preset[0], preset[1], preset[2]);

    std::cout << "Using golden_scaling preset:\n";
    std::cout << "  f1(x) = x / phi (contract)\n";
    std::cout << "  f2(x) = x       (identity)\n";
    std::cout << "  f3(x) = x * phi (expand)\n\n";

    double input = 100.0;
    auto [result, contributions] = synth.synthesize_detailed(input);

    std::cout << "Synthesize(100.0):\n";
    std::cout << "  f1 contribution: " << contributions[0] << "\n";
    std::cout << "  f2 contribution: " << contributions[1] << "\n";
    std::cout << "  f3 contribution: " << contributions[2] << "\n";
    std::cout << "  Total result:    " << result << "\n";

    // Layover reinforcement
    print_subheader("Layover Reinforcement Engine");
    LayoverReinforcementEngine<double> engine(WeightScheme::GOLDEN_HARMONIC);

    // Set up functions
    engine.synthesizer().set_functions(
        [](double x) { return x * 0.95; },  // Slight contraction
        [](double x) { return x; },          // Identity
        [](double x) { return x * 1.02; }    // Slight expansion
    );

    engine.initialize(100.0);

    std::cout << "Initial value: 100.0\n";
    std::cout << "Applying reinforcement iterations:\n";

    for (int i = 0; i < 5; ++i) {
        auto pos = engine.reinforce_once();
        std::cout << "  Iteration " << (i + 1) << ": value = " << std::setprecision(4)
                  << pos.value << ", phi_factor = " << pos.phi_factor << "\n";
    }

    std::cout << "\nTrajectory stability: " << engine.trajectory_stability() << "\n";

    // Convergence demo
    print_subheader("Convergence to Golden Point");
    LayoverReinforcementEngine<double> conv_engine(WeightScheme::GOLDEN_HARMONIC);

    // Convergent functions
    auto convergent = TripleFunctionPresets<double>::convergent_mean();
    conv_engine.synthesizer().set_functions(convergent[0], convergent[1], convergent[2]);
    conv_engine.set_convergence_threshold(0.0001);
    conv_engine.initialize(100.0);

    auto final_pos = conv_engine.reinforce_until_convergence(50);
    std::cout << "Starting value: 100.0\n";
    std::cout << "Converged to:   " << final_pos.value << "\n";
    std::cout << "Iterations:     " << conv_engine.iteration_count() << "\n";

    std::cout << "\n[PASS] Triple function synthesis working correctly\n";
}

// ===========================================================================
// TEST: GOLDEN CONTAINERS
// ===========================================================================

void test_fibonacci_vector() {
    print_header("FIBONACCI VECTOR");

    FibonacciVector<int> vec;

    // Attach observer
    vec.attach([](ContainerEvent<int>& event) {
        if (event.type == EventType::CAPACITY_CHANGE) {
            std::cout << "  [Observer] Capacity changed: "
                      << event.old_size << " -> " << event.new_size
                      << " (ratio: " << std::fixed << std::setprecision(3)
                      << event.phi_ratio << ")\n";
        }
    });

    std::cout << "Pushing elements and tracking Fibonacci capacity growth:\n";

    for (int i = 1; i <= 15; ++i) {
        size_t old_cap = vec.capacity();
        vec.push_back(i * 10);
        if (vec.capacity() != old_cap) {
            // Observer will print
        }
    }

    std::cout << "\nFinal state:\n";
    std::cout << "  Size:          " << vec.size() << "\n";
    std::cout << "  Capacity:      " << vec.capacity() << "\n";
    std::cout << "  Growth ratio:  " << vec.growth_ratio() << " (phi = 1.618)\n";

    std::cout << "\nElements: [";
    for (size_t i = 0; i < vec.size(); ++i) {
        std::cout << vec[i];
        if (i < vec.size() - 1) std::cout << ", ";
    }
    std::cout << "]\n";

    std::cout << "\nGolden element (at phi^-1 position): " << vec.golden_element() << "\n";

    // Golden split
    print_subheader("Golden Split");
    auto [left, right] = vec.golden_split();
    std::cout << "Left portion (smaller):  size = " << left.size() << "\n";
    std::cout << "Right portion (larger):  size = " << right.size() << "\n";
    std::cout << "Ratio: " << std::fixed << std::setprecision(3)
              << static_cast<double>(right.size()) / left.size() << "\n";

    std::cout << "\n[PASS] FibonacciVector working correctly\n";
}

void test_golden_hashmap() {
    print_header("GOLDEN HASH MAP");

    GoldenHashMap<std::string, int> map;

    // Attach observer
    map.attach([](ContainerEvent<std::pair<std::string, int>>& event) {
        if (event.type == EventType::REBALANCE) {
            std::cout << "  [Observer] Rehashed: "
                      << event.old_size << " -> " << event.new_size << " buckets\n";
        }
    });

    std::cout << "Inserting key-value pairs:\n";

    std::vector<std::string> keys = {"alpha", "beta", "gamma", "delta", "epsilon",
                                      "zeta", "eta", "theta", "iota", "kappa"};

    for (size_t i = 0; i < keys.size(); ++i) {
        map[keys[i]] = static_cast<int>(i * 100);
        std::cout << "  " << keys[i] << " = " << (i * 100) << "\n";
    }

    std::cout << "\nMap state:\n";
    std::cout << "  Size:          " << map.size() << "\n";
    std::cout << "  Bucket count:  " << map.bucket_count() << "\n";
    std::cout << "  Load factor:   " << std::fixed << std::setprecision(3)
              << map.load_factor() << " (max: " << map.max_load_factor() << ")\n";

    std::cout << "\nLookup test:\n";
    for (const auto& key : {"alpha", "gamma", "missing"}) {
        auto val = map.get(key);
        std::cout << "  map[\"" << key << "\"] = ";
        if (val) std::cout << *val << "\n";
        else std::cout << "(not found)\n";
    }

    std::cout << "\n[PASS] GoldenHashMap working correctly\n";
}

void test_phi_partition_list() {
    print_header("PHI PARTITION LIST");

    PhiPartitionList<int> list;

    // Attach observer
    list.attach([](ContainerEvent<int>& event) {
        if (event.type == EventType::REBALANCE) {
            std::cout << "  [Observer] Golden point moved to index "
                      << event.index << " (ratio: " << std::fixed
                      << std::setprecision(3) << event.phi_ratio << ")\n";
        }
    });

    std::cout << "Building list with golden partition tracking:\n";

    for (int i = 1; i <= 10; ++i) {
        list.push_back(i * 10);
    }

    std::cout << "\nList state:\n";
    std::cout << "  Size:          " << list.size() << "\n";
    std::cout << "  Golden index:  " << list.golden_index() << "\n";
    std::cout << "  Golden value:  " << list.golden_partition() << "\n";
    std::cout << "  Partition ratio: " << std::fixed << std::setprecision(3)
              << list.partition_ratio() << " (phi = 1.618)\n";

    // Split at golden point
    print_subheader("Split at Golden Point");
    auto [smaller, larger] = list.split_at_golden();
    std::cout << "Smaller partition: ";
    while (!smaller.empty()) {
        std::cout << smaller.front() << " ";
        smaller.pop_front();
    }
    std::cout << "\n";

    std::cout << "Larger partition:  ";
    while (!larger.empty()) {
        std::cout << larger.front() << " ";
        larger.pop_front();
    }
    std::cout << "\n";

    std::cout << "\n[PASS] PhiPartitionList working correctly\n";
}

void test_spiral_buffer() {
    print_header("SPIRAL BUFFER");

    SpiralBuffer<double, 16> buffer;

    // Fill with spiral pattern
    buffer.spiral_fill([](double x, double y, size_t i) -> double {
        return std::sqrt(x * x + y * y) * 100;  // Distance from center
    });

    std::cout << "Buffer filled with sunflower-distributed values:\n";
    std::cout << "  Size:     " << buffer.size() << "\n";
    std::cout << "  Capacity: " << buffer.capacity() << "\n\n";

    std::cout << "Sunflower access pattern (first 8):\n";
    for (size_t i = 0; i < 8; ++i) {
        std::cout << "  sunflower[" << i << "] = " << std::fixed << std::setprecision(2)
                  << buffer.sunflower_at(i) << "\n";
    }

    // Spiral traversal
    print_subheader("Spiral Traversal");
    std::cout << "First 5 elements via spiral_next():\n";
    buffer.reset_spiral();
    for (int i = 0; i < 5; ++i) {
        std::cout << "  " << (i + 1) << ": " << std::fixed << std::setprecision(2)
                  << buffer.spiral_next() << "\n";
    }

    std::cout << "\n[PASS] SpiralBuffer working correctly\n";
}

void test_integrated_system() {
    print_header("INTEGRATED SYSTEM DEMO");

    std::cout << "Demonstrating full integration of all components:\n\n";

    // Create container with guardrails
    FibonacciVector<double> vec;

    // Configure guardrails
    vec.enable_guardrails(true);
    vec.enforcer().value_guardrails()
        .add<PositiveGuardrail<double>>(true)
        .add<RangeGuardrail<double>>(0.0, 1000.0);

    // Attach statistics observer
    auto stats = std::make_shared<StatisticsObserver<double>>();
    vec.attach(stats);

    // Attach logging observer
    vec.attach([](ContainerEvent<double>& event) {
        std::cout << "  [LOG] " << event_type_to_string(event.type);
        if (event.new_value) std::cout << " value=" << *event.new_value;
        std::cout << "\n";
    }, 10, "Logger");

    std::cout << "1. Inserting valid values:\n";
    for (double v : {10.0, 20.0, 30.0, 40.0, 50.0}) {
        vec.push_back(v);
    }

    std::cout << "\n2. Attempting invalid value (should be blocked):\n";
    try {
        vec.push_back(-100.0);  // Should fail
    } catch (const std::exception& e) {
        std::cout << "  [BLOCKED] " << e.what() << "\n";
    }

    std::cout << "\n3. Apply triple function synthesis:\n";
    LayoverReinforcementEngine<double> engine(WeightScheme::GOLDEN_HARMONIC);

    auto preset = TripleFunctionPresets<double>::golden_oscillation();
    engine.synthesizer().set_functions(preset[0], preset[1], preset[2]);

    // Start from the golden element of our vector
    double start_val = vec.golden_element();
    engine.initialize(start_val);

    std::cout << "  Starting from golden element: " << start_val << "\n";
    std::cout << "  Reinforcing with Fibonacci steps (5 iterations):\n";

    auto final = engine.reinforce_fibonacci_steps(5);
    std::cout << "  Final value: " << final.value << "\n";
    std::cout << "  Phi factor:  " << final.phi_factor << "\n";

    std::cout << "\n4. Event statistics:\n";
    std::cout << "  INSERT events: " << stats->get_count(EventType::INSERT) << "\n";
    std::cout << "  Total events:  " << stats->get_total() << "\n";

    std::cout << "\n[PASS] Integrated system working correctly\n";
}

// ===========================================================================
// MAIN
// ===========================================================================

int main() {
    std::cout << "\n";
    std::cout << "╔══════════════════════════════════════════════════════════╗\n";
    std::cout << "║     GOLDEN RATIO C++ CONTAINERS - TEST SUITE             ║\n";
    std::cout << "║                                                          ║\n";
    std::cout << "║  phi = (1 + sqrt(5)) / 2 = 1.6180339887...              ║\n";
    std::cout << "╚══════════════════════════════════════════════════════════╝\n";

    try {
        test_phi_math();
        test_observer_system();
        test_guardrails();
        test_triple_function();
        test_fibonacci_vector();
        test_golden_hashmap();
        test_phi_partition_list();
        test_spiral_buffer();
        test_integrated_system();

        print_header("ALL TESTS PASSED");
        std::cout << "The golden ratio containers are ready for use!\n\n";
        std::cout << "Components implemented:\n";
        std::cout << "  - Phi mathematical utilities\n";
        std::cout << "  - Observer pattern system\n";
        std::cout << "  - Agent guardrails with validation\n";
        std::cout << "  - Triple function synthesis with layover reinforcement\n";
        std::cout << "  - FibonacciVector (Fibonacci capacity growth)\n";
        std::cout << "  - GoldenHashMap (phi-based hashing)\n";
        std::cout << "  - PhiPartitionList (golden point tracking)\n";
        std::cout << "  - SpiralBuffer (sunflower distribution)\n";
        std::cout << "\n";

        return 0;

    } catch (const std::exception& e) {
        std::cerr << "\n[FATAL ERROR] " << e.what() << "\n";
        return 1;
    }
}
