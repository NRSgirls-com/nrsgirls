# Golden Ratio C++ Containers

C++ container implementations that leverage the golden ratio (phi = 1.618...) for optimal algorithms, with integrated observer pattern and agent guardrails.

## Components

### 1. Phi Math Utilities (`phi_math.hpp`)
- Golden ratio constants with maximum precision
- Fibonacci sequence generation (Binet's formula & matrix method)
- Golden partitioning and section points
- Golden spiral calculations
- Sunflower/phyllotaxis point distribution
- Phi-based multiplicative hashing

### 2. Observer System (`observer_system.hpp`)
- Type-safe event dispatching
- Priority-based observer ordering
- Event filtering and propagation control
- Thread-safe notifications
- Built-in observers: Logging, Statistics, Rebalance

### 3. Agent Guardrails (`agent_guardrails.hpp`)
- Value range validation
- Fibonacci number validation
- Golden ratio invariant enforcement
- Capacity limits with warning thresholds
- Rate limiting
- Composite guardrail chains
- Agent boundary enforcer with lockout

### 4. Triple Function Synthesis (`triple_function.hpp`)
- Phi-weighted function combination
- Layover position reinforcement
- Multiple weight schemes (Golden Harmonic, Fibonacci Triple, Phi Power)
- Convergence detection
- Fibonacci-stepping reinforcement
- Preset function combinations

### 5. Golden Containers (`golden_containers.hpp`)

#### FibonacciVector
Dynamic array with Fibonacci-based capacity growth (1.618x vs traditional 2x).

#### GoldenHashMap
Hash map using golden ratio multiplicative hashing for optimal distribution.

#### PhiPartitionList
Doubly-linked list that maintains a "golden point" dividing the list by phi.

#### SpiralBuffer
Circular buffer with golden spiral access patterns and sunflower distribution.

## Building

```bash
mkdir build && cd build
cmake ..
make
./golden_demo
```

## Example Usage

```cpp
#include "golden_containers.hpp"
using namespace golden::containers;

// Fibonacci-growth vector
FibonacciVector<int> vec;
for (int i = 0; i < 100; ++i) {
    vec.push_back(i);
}
// Capacity grows: 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89...

// Get element at golden section
int golden_elem = vec.golden_element();

// Split at golden ratio
auto [left, right] = vec.golden_split();
// right.size() / left.size() ≈ 1.618

// Golden hash map
GoldenHashMap<std::string, int> map;
map["key"] = 42;  // Uses phi-based hashing

// Phi partition list
PhiPartitionList<double> list;
list.push_back(1.0);
list.push_back(2.0);
double at_golden = list.golden_partition();

// Spiral buffer
SpiralBuffer<double, 64> buffer;
buffer.spiral_fill([](double x, double y, size_t i) {
    return std::sqrt(x*x + y*y);  // Sunflower pattern
});
```

## Triple Function Synthesis

```cpp
#include "triple_function.hpp"
using namespace golden::synthesis;

LayoverReinforcementEngine<double> engine(WeightScheme::GOLDEN_HARMONIC);

// Set up triple functions
engine.synthesizer().set_functions(
    [](double x) { return x * 0.618; },  // Contract
    [](double x) { return x; },           // Identity
    [](double x) { return x * 1.618; }    // Expand
);

engine.initialize(100.0);
auto final = engine.reinforce_until_convergence(50);
```

## Requirements
- C++17 or later
- CMake 3.14+
