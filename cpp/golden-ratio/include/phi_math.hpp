/**
 * @file phi_math.hpp
 * @brief Golden Ratio (Phi) Mathematical Utilities
 *
 * Implements phi-based mathematical operations for container algorithms.
 * Phi (φ) = (1 + √5) / 2 ≈ 1.6180339887...
 *
 * Properties:
 *   - φ² = φ + 1
 *   - 1/φ = φ - 1
 *   - Fibonacci sequence approaches φ as ratio of consecutive terms
 */

#ifndef PHI_MATH_HPP
#define PHI_MATH_HPP

#include <cmath>
#include <cstdint>
#include <array>
#include <limits>
#include <type_traits>

namespace golden {

// ===========================================================================
// CONSTANTS
// ===========================================================================

/**
 * @brief Core golden ratio constants with maximum precision
 */
struct PhiConstants {
    // Primary golden ratio: φ = (1 + √5) / 2
    static constexpr double PHI = 1.6180339887498948482045868343656381177203091798057628621354;

    // Conjugate golden ratio: ψ = (1 - √5) / 2 = 1 - φ = -1/φ
    static constexpr double PSI = -0.6180339887498948482045868343656381177203091798057628621354;

    // Golden ratio reciprocal: 1/φ = φ - 1
    static constexpr double PHI_RECIPROCAL = 0.6180339887498948482045868343656381177203091798057628621354;

    // Golden angle in radians: 2π/φ² ≈ 2.399963...
    static constexpr double GOLDEN_ANGLE = 2.3999632297286533222315555066336138531249990110581150429351;

    // Golden angle in degrees: 360/φ² ≈ 137.5077...
    static constexpr double GOLDEN_ANGLE_DEG = 137.5077640500378546463487396702841490202522193573782249774;

    // Square root of 5 (used in Binet's formula)
    static constexpr double SQRT_5 = 2.2360679774997896964091736687747632440588203494105939986257;

    // Phi squared: φ² = φ + 1
    static constexpr double PHI_SQUARED = 2.6180339887498948482045868343656381177203091798057628621354;

    // Phi cubed: φ³ = φ² + φ = 2φ + 1
    static constexpr double PHI_CUBED = 4.2360679774997896964091736687747632440588203494105939986257;
};

// ===========================================================================
// FIBONACCI SEQUENCE OPERATIONS
// ===========================================================================

/**
 * @brief Calculate nth Fibonacci number using Binet's formula
 *
 * F(n) = (φⁿ - ψⁿ) / √5
 *
 * @param n Index in Fibonacci sequence (0-indexed)
 * @return nth Fibonacci number
 */
template<typename T = uint64_t>
constexpr T fibonacci_binet(size_t n) {
    if (n == 0) return 0;
    if (n == 1 || n == 2) return 1;

    const double phi_n = std::pow(PhiConstants::PHI, static_cast<double>(n));
    const double psi_n = std::pow(PhiConstants::PSI, static_cast<double>(n));

    return static_cast<T>(std::round((phi_n - psi_n) / PhiConstants::SQRT_5));
}

/**
 * @brief Calculate nth Fibonacci number using matrix exponentiation
 *
 * More accurate for large n than Binet's formula (avoids floating point errors)
 *
 * @param n Index in Fibonacci sequence
 * @return nth Fibonacci number
 */
template<typename T = uint64_t>
constexpr T fibonacci_matrix(size_t n) {
    if (n == 0) return 0;
    if (n == 1 || n == 2) return 1;

    T a = 0, b = 1, c, d = 1, tmp;
    T rc = 1, rd = 0;

    while (n) {
        if (n & 1) {
            tmp = rc * d + rd * c;
            rc = rc * c + rd * d;
            rd = tmp;
        }
        tmp = c * d + d * c;
        c = c * c + d * d;
        d = tmp;
        n >>= 1;
    }

    return rc;
}

/**
 * @brief Generate first N Fibonacci numbers
 *
 * @tparam N Number of Fibonacci values to generate
 * @return Array of first N Fibonacci numbers
 */
template<size_t N, typename T = uint64_t>
constexpr std::array<T, N> generate_fibonacci_sequence() {
    std::array<T, N> fib{};
    if constexpr (N >= 1) fib[0] = 0;
    if constexpr (N >= 2) fib[1] = 1;

    for (size_t i = 2; i < N; ++i) {
        fib[i] = fib[i-1] + fib[i-2];
    }

    return fib;
}

// ===========================================================================
// GOLDEN RATIO PARTITIONING
// ===========================================================================

/**
 * @brief Split a value using golden ratio proportion
 *
 * Given a total, returns the larger and smaller portions that divide
 * the total according to the golden ratio: larger/smaller = φ
 *
 * @param total Value to partition
 * @return Pair of (larger_portion, smaller_portion)
 */
template<typename T>
constexpr std::pair<T, T> golden_partition(T total) {
    static_assert(std::is_arithmetic_v<T>, "Type must be arithmetic");

    if constexpr (std::is_floating_point_v<T>) {
        T larger = total / PhiConstants::PHI;
        T smaller = total - larger;
        return {smaller, larger};  // larger = total * φ^-1, smaller = total * φ^-2
    } else {
        T larger = static_cast<T>(static_cast<double>(total) * PhiConstants::PHI_RECIPROCAL);
        T smaller = total - larger;
        return {larger, smaller};
    }
}

/**
 * @brief Calculate golden section point between two values
 *
 * @param a Start value
 * @param b End value
 * @return Golden section point: a + (b - a) / φ
 */
template<typename T>
constexpr T golden_section_point(T a, T b) {
    return a + static_cast<T>((b - a) * PhiConstants::PHI_RECIPROCAL);
}

/**
 * @brief Calculate optimal bucket size using golden ratio
 *
 * For hash tables and similar structures, phi-based sizing
 * provides better distribution than power-of-2 sizing.
 *
 * @param n Number of elements to store
 * @param load_factor Desired load factor (default: 0.618 = 1/φ)
 * @return Optimal bucket count
 */
template<typename T = size_t>
constexpr T golden_bucket_size(size_t n, double load_factor = PhiConstants::PHI_RECIPROCAL) {
    return static_cast<T>(std::ceil(static_cast<double>(n) / load_factor));
}

// ===========================================================================
// GOLDEN SPIRAL CALCULATIONS
// ===========================================================================

/**
 * @brief Calculate radius at angle θ on a golden spiral
 *
 * r = a * e^(b*θ) where b = ln(φ) / (π/2)
 *
 * @param theta Angle in radians
 * @param scale Initial radius scale (default: 1.0)
 * @return Radius at the given angle
 */
template<typename T = double>
constexpr T golden_spiral_radius(T theta, T scale = 1.0) {
    constexpr double b = std::log(PhiConstants::PHI) / (M_PI / 2.0);
    return scale * std::exp(b * theta);
}

/**
 * @brief Calculate x,y coordinates on a golden spiral
 *
 * @param theta Angle in radians
 * @param scale Initial radius scale
 * @return Pair of (x, y) coordinates
 */
template<typename T = double>
constexpr std::pair<T, T> golden_spiral_point(T theta, T scale = 1.0) {
    T r = golden_spiral_radius(theta, scale);
    return {r * std::cos(theta), r * std::sin(theta)};
}

/**
 * @brief Sunflower/phyllotaxis point distribution
 *
 * Distributes n points using the golden angle for optimal packing.
 * Used in nature for leaf/seed arrangement.
 *
 * @param index Point index (0 to n-1)
 * @param n Total number of points
 * @param scale Radius scale factor
 * @return Pair of (x, y) coordinates
 */
template<typename T = double>
constexpr std::pair<T, T> sunflower_point(size_t index, size_t n, T scale = 1.0) {
    T theta = index * PhiConstants::GOLDEN_ANGLE;
    T r = scale * std::sqrt(static_cast<T>(index) / static_cast<T>(n));
    return {r * std::cos(theta), r * std::sin(theta)};
}

// ===========================================================================
// GOLDEN RATIO VERIFICATION
// ===========================================================================

/**
 * @brief Check if a ratio approximates the golden ratio
 *
 * @param a First value (larger)
 * @param b Second value (smaller)
 * @param tolerance Acceptable deviation (default: 1e-6)
 * @return true if a/b ≈ φ
 */
template<typename T>
constexpr bool is_golden_ratio(T a, T b, double tolerance = 1e-6) {
    if (b == 0) return false;
    double ratio = static_cast<double>(a) / static_cast<double>(b);
    return std::abs(ratio - PhiConstants::PHI) < tolerance;
}

/**
 * @brief Check if a value is a Fibonacci number
 *
 * A number is Fibonacci iff one of (5n² + 4) or (5n² - 4) is a perfect square.
 *
 * @param n Value to check
 * @return true if n is a Fibonacci number
 */
template<typename T>
constexpr bool is_fibonacci(T n) {
    if (n < 0) return false;

    auto is_perfect_square = [](T x) -> bool {
        T s = static_cast<T>(std::sqrt(static_cast<double>(x)));
        return s * s == x || (s + 1) * (s + 1) == x;
    };

    T five_n_sq = 5 * n * n;
    return is_perfect_square(five_n_sq + 4) || is_perfect_square(five_n_sq - 4);
}

// ===========================================================================
// PHI-BASED HASHING
// ===========================================================================

/**
 * @brief Golden ratio hash function (multiplicative hashing)
 *
 * Uses φ^-1 * 2^32 as the multiplier for excellent distribution.
 *
 * @param key Value to hash
 * @param table_size Size of hash table
 * @return Hash bucket index
 */
template<typename T>
constexpr size_t golden_hash(T key, size_t table_size) {
    // Golden ratio fractional part as 32-bit integer: (φ^-1 * 2^32)
    constexpr uint32_t GOLDEN_MULT = 2654435769u;  // 0x9E3779B9

    uint32_t hash = static_cast<uint32_t>(key) * GOLDEN_MULT;
    return static_cast<size_t>(hash % table_size);
}

/**
 * @brief 64-bit golden ratio hash
 *
 * Uses φ^-1 * 2^64 for 64-bit keys.
 *
 * @param key 64-bit value to hash
 * @param table_size Size of hash table
 * @return Hash bucket index
 */
constexpr size_t golden_hash_64(uint64_t key, size_t table_size) {
    // Golden ratio fractional part as 64-bit: 0x9E3779B97F4A7C15
    constexpr uint64_t GOLDEN_MULT_64 = 11400714819323198485ull;

    uint64_t hash = key * GOLDEN_MULT_64;
    return static_cast<size_t>(hash % table_size);
}

} // namespace golden

#endif // PHI_MATH_HPP
