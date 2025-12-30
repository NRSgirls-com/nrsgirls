/**
 * @file golden_containers.hpp
 * @brief Golden Ratio C++ Containers
 *
 * Container implementations that leverage phi (φ) properties:
 *
 *   - FibonacciVector:    Dynamic array with Fibonacci-based capacity growth
 *   - GoldenHashMap:      Hash map using golden ratio multiplicative hashing
 *   - PhiPartitionList:   List that maintains golden-ratio partitioning
 *   - SpiralBuffer:       Circular buffer with golden spiral access patterns
 *
 * All containers integrate with:
 *   - Observer system for state change notifications
 *   - Agent guardrails for value/capacity validation
 *   - Triple function synthesis for advanced operations
 */

#ifndef GOLDEN_CONTAINERS_HPP
#define GOLDEN_CONTAINERS_HPP

#include "phi_math.hpp"
#include "observer_system.hpp"
#include "agent_guardrails.hpp"
#include "triple_function.hpp"

#include <vector>
#include <list>
#include <array>
#include <memory>
#include <functional>
#include <optional>
#include <iterator>
#include <stdexcept>
#include <algorithm>

namespace golden {
namespace containers {

// ===========================================================================
// FIBONACCI VECTOR
// ===========================================================================

/**
 * @brief Dynamic array with Fibonacci-based capacity growth
 *
 * Instead of doubling capacity like std::vector, this grows capacity
 * following the Fibonacci sequence, approaching the golden ratio.
 *
 * Benefits:
 *   - Smoother memory growth (1.618x vs 2x)
 *   - Better cache utilization
 *   - Natural mathematical properties
 */
template<typename T>
class FibonacciVector : public obs::Observable<T> {
public:
    using value_type = T;
    using size_type = size_t;
    using reference = T&;
    using const_reference = const T&;
    using iterator = T*;
    using const_iterator = const T*;

private:
    std::unique_ptr<T[]> data_;
    size_type size_ = 0;
    size_type capacity_ = 0;
    size_type fib_current_ = 1;  // Current Fibonacci number (capacity)
    size_type fib_previous_ = 1; // Previous Fibonacci number

    guardrails::AgentBoundaryEnforcer<T> enforcer_;
    bool guardrails_enabled_ = false;

public:
    FibonacciVector()
        : obs::Observable<T>("FibonacciVector") {}

    explicit FibonacciVector(size_type initial_capacity)
        : obs::Observable<T>("FibonacciVector") {
        reserve(initial_capacity);
    }

    FibonacciVector(std::initializer_list<T> init)
        : obs::Observable<T>("FibonacciVector") {
        reserve(init.size());
        for (const auto& val : init) {
            push_back(val);
        }
    }

    // Copy constructor
    FibonacciVector(const FibonacciVector& other)
        : obs::Observable<T>("FibonacciVector")
        , size_(other.size_)
        , capacity_(other.capacity_)
        , fib_current_(other.fib_current_)
        , fib_previous_(other.fib_previous_) {
        if (capacity_ > 0) {
            data_ = std::make_unique<T[]>(capacity_);
            std::copy(other.begin(), other.end(), data_.get());
        }
    }

    // Move constructor
    FibonacciVector(FibonacciVector&& other) noexcept
        : obs::Observable<T>("FibonacciVector")
        , data_(std::move(other.data_))
        , size_(other.size_)
        , capacity_(other.capacity_)
        , fib_current_(other.fib_current_)
        , fib_previous_(other.fib_previous_) {
        other.size_ = 0;
        other.capacity_ = 0;
    }

    // Destructor
    ~FibonacciVector() = default;

    // Assignment operators
    FibonacciVector& operator=(const FibonacciVector& other) {
        if (this != &other) {
            FibonacciVector tmp(other);
            swap(tmp);
        }
        return *this;
    }

    FibonacciVector& operator=(FibonacciVector&& other) noexcept {
        if (this != &other) {
            data_ = std::move(other.data_);
            size_ = other.size_;
            capacity_ = other.capacity_;
            fib_current_ = other.fib_current_;
            fib_previous_ = other.fib_previous_;
            other.size_ = 0;
            other.capacity_ = 0;
        }
        return *this;
    }

    // Guardrails configuration
    guardrails::AgentBoundaryEnforcer<T>& enforcer() { return enforcer_; }
    void enable_guardrails(bool enabled = true) { guardrails_enabled_ = enabled; }

    // Element access
    reference operator[](size_type index) {
        return data_[index];
    }

    const_reference operator[](size_type index) const {
        return data_[index];
    }

    reference at(size_type index) {
        if (index >= size_) {
            throw std::out_of_range("FibonacciVector::at: index out of range");
        }
        return data_[index];
    }

    const_reference at(size_type index) const {
        if (index >= size_) {
            throw std::out_of_range("FibonacciVector::at: index out of range");
        }
        return data_[index];
    }

    reference front() { return data_[0]; }
    const_reference front() const { return data_[0]; }
    reference back() { return data_[size_ - 1]; }
    const_reference back() const { return data_[size_ - 1]; }
    T* data() { return data_.get(); }
    const T* data() const { return data_.get(); }

    // Iterators
    iterator begin() { return data_.get(); }
    iterator end() { return data_.get() + size_; }
    const_iterator begin() const { return data_.get(); }
    const_iterator end() const { return data_.get() + size_; }
    const_iterator cbegin() const { return data_.get(); }
    const_iterator cend() const { return data_.get() + size_; }

    // Capacity
    bool empty() const { return size_ == 0; }
    size_type size() const { return size_; }
    size_type capacity() const { return capacity_; }

    /**
     * @brief Reserve capacity following Fibonacci growth
     */
    void reserve(size_type new_capacity) {
        if (new_capacity <= capacity_) return;

        // Grow to next Fibonacci number that fits
        while (fib_current_ < new_capacity) {
            size_type next = fib_current_ + fib_previous_;
            fib_previous_ = fib_current_;
            fib_current_ = next;
        }

        size_type old_capacity = capacity_;
        capacity_ = fib_current_;

        auto new_data = std::make_unique<T[]>(capacity_);
        if (data_) {
            std::move(data_.get(), data_.get() + size_, new_data.get());
        }
        data_ = std::move(new_data);

        // Emit capacity change event
        obs::ContainerEvent<T> event(obs::EventType::CAPACITY_CHANGE);
        event.old_size = old_capacity;
        event.new_size = capacity_;
        event.phi_ratio = static_cast<double>(capacity_) / old_capacity;
        this->notify(event);
    }

    void shrink_to_fit() {
        if (size_ < capacity_) {
            // Find smallest Fibonacci >= size
            fib_current_ = 1;
            fib_previous_ = 1;
            while (fib_current_ < size_) {
                size_type next = fib_current_ + fib_previous_;
                fib_previous_ = fib_current_;
                fib_current_ = next;
            }

            capacity_ = fib_current_;
            auto new_data = std::make_unique<T[]>(capacity_);
            std::move(data_.get(), data_.get() + size_, new_data.get());
            data_ = std::move(new_data);
        }
    }

    // Modifiers
    void clear() {
        size_ = 0;
        this->emit(obs::EventType::CLEAR);
    }

    void push_back(const T& value) {
        if (guardrails_enabled_) {
            auto response = enforcer_.check_action(
                guardrails::AgentBoundaryEnforcer<T>::Action::INSERT, value);
            if (response == guardrails::AgentBoundaryEnforcer<T>::Response::DENY) {
                throw std::runtime_error("Guardrail denied insert operation");
            }
        }

        if (size_ >= capacity_) {
            reserve(size_ + 1);
        }

        data_[size_++] = value;

        obs::ContainerEvent<T> event(obs::EventType::INSERT);
        event.new_value = value;
        event.index = size_ - 1;
        event.new_size = size_;
        this->notify(event);
    }

    void push_back(T&& value) {
        if (guardrails_enabled_) {
            auto response = enforcer_.check_action(
                guardrails::AgentBoundaryEnforcer<T>::Action::INSERT, value);
            if (response == guardrails::AgentBoundaryEnforcer<T>::Response::DENY) {
                throw std::runtime_error("Guardrail denied insert operation");
            }
        }

        if (size_ >= capacity_) {
            reserve(size_ + 1);
        }

        data_[size_++] = std::move(value);

        obs::ContainerEvent<T> event(obs::EventType::INSERT);
        event.index = size_ - 1;
        event.new_size = size_;
        this->notify(event);
    }

    template<typename... Args>
    reference emplace_back(Args&&... args) {
        if (size_ >= capacity_) {
            reserve(size_ + 1);
        }

        data_[size_] = T(std::forward<Args>(args)...);

        obs::ContainerEvent<T> event(obs::EventType::INSERT);
        event.new_value = data_[size_];
        event.index = size_;
        event.new_size = size_ + 1;
        this->notify(event);

        return data_[size_++];
    }

    void pop_back() {
        if (size_ > 0) {
            obs::ContainerEvent<T> event(obs::EventType::REMOVE);
            event.old_value = data_[size_ - 1];
            event.index = size_ - 1;

            --size_;

            event.new_size = size_;
            this->notify(event);
        }
    }

    void resize(size_type count) {
        if (count > capacity_) {
            reserve(count);
        }

        size_type old_size = size_;
        size_ = count;

        obs::ContainerEvent<T> event(obs::EventType::RESIZE);
        event.old_size = old_size;
        event.new_size = size_;
        this->notify(event);
    }

    void swap(FibonacciVector& other) noexcept {
        std::swap(data_, other.data_);
        std::swap(size_, other.size_);
        std::swap(capacity_, other.capacity_);
        std::swap(fib_current_, other.fib_current_);
        std::swap(fib_previous_, other.fib_previous_);
    }

    // Golden ratio specific operations

    /**
     * @brief Get element at golden section point
     */
    const_reference golden_element() const {
        if (empty()) throw std::runtime_error("Empty vector");
        size_type index = static_cast<size_type>(size_ * PhiConstants::PHI_RECIPROCAL);
        return data_[index];
    }

    /**
     * @brief Split vector at golden ratio point
     */
    std::pair<FibonacciVector, FibonacciVector> golden_split() const {
        size_type split_point = static_cast<size_type>(size_ * PhiConstants::PHI_RECIPROCAL);

        FibonacciVector left, right;
        left.reserve(split_point);
        right.reserve(size_ - split_point);

        for (size_type i = 0; i < split_point; ++i) {
            left.push_back(data_[i]);
        }
        for (size_type i = split_point; i < size_; ++i) {
            right.push_back(data_[i]);
        }

        return {std::move(left), std::move(right)};
    }

    /**
     * @brief Get growth ratio (approaches φ as container grows)
     */
    double growth_ratio() const {
        if (fib_previous_ == 0) return PhiConstants::PHI;
        return static_cast<double>(fib_current_) / fib_previous_;
    }
};

// ===========================================================================
// GOLDEN HASH MAP
// ===========================================================================

/**
 * @brief Hash map using golden ratio multiplicative hashing
 *
 * Uses φ^-1 * 2^32 as the hash multiplier for optimal distribution.
 * Bucket count follows Fibonacci sequence.
 */
template<typename K, typename V>
class GoldenHashMap : public obs::Observable<std::pair<K, V>> {
public:
    using key_type = K;
    using mapped_type = V;
    using value_type = std::pair<K, V>;
    using size_type = size_t;

private:
    struct Bucket {
        std::list<value_type> entries;
    };

    std::vector<Bucket> buckets_;
    size_type size_ = 0;
    size_type bucket_count_ = 0;
    double max_load_factor_ = PhiConstants::PHI_RECIPROCAL;  // 0.618

public:
    GoldenHashMap()
        : obs::Observable<value_type>("GoldenHashMap") {
        rehash(8);  // Start with Fibonacci number
    }

    explicit GoldenHashMap(size_type initial_buckets)
        : obs::Observable<value_type>("GoldenHashMap") {
        rehash(initial_buckets);
    }

    // Capacity
    bool empty() const { return size_ == 0; }
    size_type size() const { return size_; }
    size_type bucket_count() const { return bucket_count_; }
    double load_factor() const {
        return bucket_count_ > 0 ? static_cast<double>(size_) / bucket_count_ : 0;
    }
    double max_load_factor() const { return max_load_factor_; }
    void max_load_factor(double ml) { max_load_factor_ = ml; }

    // Lookup
    V& operator[](const K& key) {
        size_type bucket_idx = hash_key(key);
        auto& bucket = buckets_[bucket_idx];

        for (auto& entry : bucket.entries) {
            if (entry.first == key) {
                return entry.second;
            }
        }

        // Insert new entry
        bucket.entries.emplace_back(key, V{});
        size_++;

        obs::ContainerEvent<value_type> event(obs::EventType::INSERT);
        event.new_value = bucket.entries.back();
        this->notify(event);

        check_load_factor();
        return bucket.entries.back().second;
    }

    std::optional<V> get(const K& key) const {
        size_type bucket_idx = hash_key(key);
        const auto& bucket = buckets_[bucket_idx];

        for (const auto& entry : bucket.entries) {
            if (entry.first == key) {
                return entry.second;
            }
        }
        return std::nullopt;
    }

    bool contains(const K& key) const {
        return get(key).has_value();
    }

    // Modifiers
    void insert(const K& key, const V& value) {
        (*this)[key] = value;
    }

    bool erase(const K& key) {
        size_type bucket_idx = hash_key(key);
        auto& bucket = buckets_[bucket_idx];

        for (auto it = bucket.entries.begin(); it != bucket.entries.end(); ++it) {
            if (it->first == key) {
                obs::ContainerEvent<value_type> event(obs::EventType::REMOVE);
                event.old_value = *it;
                this->notify(event);

                bucket.entries.erase(it);
                size_--;
                return true;
            }
        }
        return false;
    }

    void clear() {
        for (auto& bucket : buckets_) {
            bucket.entries.clear();
        }
        size_ = 0;
        this->emit(obs::EventType::CLEAR);
    }

    void rehash(size_type count) {
        // Round up to next Fibonacci number
        size_type fib_prev = 1, fib_curr = 1;
        while (fib_curr < count) {
            size_type next = fib_curr + fib_prev;
            fib_prev = fib_curr;
            fib_curr = next;
        }

        size_type new_count = fib_curr;
        if (new_count == bucket_count_) return;

        std::vector<Bucket> new_buckets(new_count);
        size_type old_count = bucket_count_;
        bucket_count_ = new_count;

        // Rehash all entries
        for (auto& bucket : buckets_) {
            for (auto& entry : bucket.entries) {
                size_type new_idx = hash_key(entry.first);
                new_buckets[new_idx].entries.push_back(std::move(entry));
            }
        }

        buckets_ = std::move(new_buckets);

        obs::ContainerEvent<value_type> event(obs::EventType::REBALANCE);
        event.old_size = old_count;
        event.new_size = bucket_count_;
        event.phi_ratio = static_cast<double>(bucket_count_) / old_count;
        this->notify(event);
    }

private:
    size_type hash_key(const K& key) const {
        return golden_hash(std::hash<K>{}(key), bucket_count_);
    }

    void check_load_factor() {
        if (load_factor() > max_load_factor_) {
            rehash(bucket_count_ * 2);  // Will be rounded to Fibonacci
        }
    }
};

// ===========================================================================
// PHI PARTITION LIST
// ===========================================================================

/**
 * @brief Doubly-linked list that maintains golden ratio partitioning
 *
 * Automatically maintains a "golden point" pointer that divides
 * the list according to φ.
 */
template<typename T>
class PhiPartitionList : public obs::Observable<T> {
public:
    using value_type = T;
    using size_type = size_t;

private:
    struct Node {
        T data;
        std::shared_ptr<Node> prev;
        std::shared_ptr<Node> next;

        explicit Node(const T& val) : data(val) {}
        explicit Node(T&& val) : data(std::move(val)) {}
    };

    using NodePtr = std::shared_ptr<Node>;

    NodePtr head_;
    NodePtr tail_;
    NodePtr golden_point_;  // Node at φ^-1 position
    size_type size_ = 0;
    size_type golden_index_ = 0;

public:
    PhiPartitionList()
        : obs::Observable<T>("PhiPartitionList") {}

    // Capacity
    bool empty() const { return size_ == 0; }
    size_type size() const { return size_; }

    // Element access
    T& front() { return head_->data; }
    const T& front() const { return head_->data; }
    T& back() { return tail_->data; }
    const T& back() const { return tail_->data; }

    /**
     * @brief Access element at the golden partition point
     */
    T& golden_partition() {
        if (!golden_point_) throw std::runtime_error("Empty list");
        return golden_point_->data;
    }

    const T& golden_partition() const {
        if (!golden_point_) throw std::runtime_error("Empty list");
        return golden_point_->data;
    }

    // Modifiers
    void push_front(const T& value) {
        auto node = std::make_shared<Node>(value);
        node->next = head_;
        if (head_) head_->prev = node;
        head_ = node;
        if (!tail_) tail_ = node;

        size_++;
        update_golden_point();

        obs::ContainerEvent<T> event(obs::EventType::INSERT);
        event.new_value = value;
        event.index = 0;
        event.new_size = size_;
        this->notify(event);
    }

    void push_back(const T& value) {
        auto node = std::make_shared<Node>(value);
        node->prev = tail_;
        if (tail_) tail_->next = node;
        tail_ = node;
        if (!head_) head_ = node;

        size_++;
        update_golden_point();

        obs::ContainerEvent<T> event(obs::EventType::INSERT);
        event.new_value = value;
        event.index = size_ - 1;
        event.new_size = size_;
        this->notify(event);
    }

    void pop_front() {
        if (!head_) return;

        obs::ContainerEvent<T> event(obs::EventType::REMOVE);
        event.old_value = head_->data;
        event.index = 0;

        head_ = head_->next;
        if (head_) head_->prev = nullptr;
        else tail_ = nullptr;

        size_--;
        update_golden_point();

        event.new_size = size_;
        this->notify(event);
    }

    void pop_back() {
        if (!tail_) return;

        obs::ContainerEvent<T> event(obs::EventType::REMOVE);
        event.old_value = tail_->data;
        event.index = size_ - 1;

        tail_ = tail_->prev;
        if (tail_) tail_->next = nullptr;
        else head_ = nullptr;

        size_--;
        update_golden_point();

        event.new_size = size_;
        this->notify(event);
    }

    void clear() {
        head_ = tail_ = golden_point_ = nullptr;
        size_ = 0;
        golden_index_ = 0;
        this->emit(obs::EventType::CLEAR);
    }

    /**
     * @brief Split list at golden point
     * @return Pair of (smaller list, larger list)
     */
    std::pair<PhiPartitionList, PhiPartitionList> split_at_golden() {
        PhiPartitionList smaller, larger;

        if (!golden_point_) return {smaller, larger};

        // Copy elements to smaller list (before golden point)
        NodePtr current = head_;
        while (current && current != golden_point_) {
            smaller.push_back(current->data);
            current = current->next;
        }

        // Copy elements to larger list (from golden point onwards)
        current = golden_point_;
        while (current) {
            larger.push_back(current->data);
            current = current->next;
        }

        obs::ContainerEvent<T> event(obs::EventType::PARTITION);
        event.old_size = size_;
        event.phi_ratio = PhiConstants::PHI;
        this->notify(event);

        return {std::move(smaller), std::move(larger)};
    }

    /**
     * @brief Get index of golden partition point
     */
    size_type golden_index() const { return golden_index_; }

    /**
     * @brief Get current partition ratio
     */
    double partition_ratio() const {
        if (size_ <= 1) return 1.0;
        return static_cast<double>(size_ - golden_index_) / golden_index_;
    }

private:
    void update_golden_point() {
        if (size_ == 0) {
            golden_point_ = nullptr;
            golden_index_ = 0;
            return;
        }

        size_type new_index = static_cast<size_type>(size_ * PhiConstants::PHI_RECIPROCAL);
        if (new_index == 0 && size_ > 0) new_index = 1;

        if (new_index != golden_index_ || !golden_point_) {
            golden_index_ = new_index;

            // Traverse to new golden point
            golden_point_ = head_;
            for (size_type i = 0; i < golden_index_ && golden_point_; ++i) {
                golden_point_ = golden_point_->next;
            }

            // Emit rebalance event
            obs::ContainerEvent<T> event(obs::EventType::REBALANCE);
            event.index = golden_index_;
            event.phi_ratio = partition_ratio();
            this->notify(event);
        }
    }
};

// ===========================================================================
// SPIRAL BUFFER
// ===========================================================================

/**
 * @brief Circular buffer with golden spiral access patterns
 *
 * Elements can be accessed using spiral indexing, where consecutive
 * accesses follow a golden angle pattern for optimal coverage.
 */
template<typename T, size_t N = 64>
class SpiralBuffer : public obs::Observable<T> {
public:
    using value_type = T;
    using size_type = size_t;

private:
    std::array<T, N> buffer_;
    size_type head_ = 0;
    size_type tail_ = 0;
    size_type size_ = 0;
    size_type spiral_index_ = 0;  // Current position in spiral traversal

public:
    SpiralBuffer()
        : obs::Observable<T>("SpiralBuffer") {}

    // Capacity
    static constexpr size_type max_size() { return N; }
    bool empty() const { return size_ == 0; }
    bool full() const { return size_ == N; }
    size_type size() const { return size_; }
    size_type capacity() const { return N; }

    // Standard circular buffer access
    T& front() { return buffer_[head_]; }
    const T& front() const { return buffer_[head_]; }
    T& back() { return buffer_[(tail_ - 1 + N) % N]; }
    const T& back() const { return buffer_[(tail_ - 1 + N) % N]; }

    // Modifiers
    bool push(const T& value) {
        if (full()) return false;

        buffer_[tail_] = value;
        tail_ = (tail_ + 1) % N;
        size_++;

        obs::ContainerEvent<T> event(obs::EventType::INSERT);
        event.new_value = value;
        event.index = tail_;
        event.new_size = size_;
        this->notify(event);

        return true;
    }

    bool push(T&& value) {
        if (full()) return false;

        buffer_[tail_] = std::move(value);
        tail_ = (tail_ + 1) % N;
        size_++;

        obs::ContainerEvent<T> event(obs::EventType::INSERT);
        event.index = tail_;
        event.new_size = size_;
        this->notify(event);

        return true;
    }

    std::optional<T> pop() {
        if (empty()) return std::nullopt;

        T value = std::move(buffer_[head_]);
        head_ = (head_ + 1) % N;
        size_--;

        obs::ContainerEvent<T> event(obs::EventType::REMOVE);
        event.old_value = value;
        event.new_size = size_;
        this->notify(event);

        return value;
    }

    void clear() {
        head_ = tail_ = size_ = spiral_index_ = 0;
        this->emit(obs::EventType::CLEAR);
    }

    // Golden spiral access

    /**
     * @brief Get next element using golden spiral traversal
     *
     * Uses the golden angle to step through the buffer,
     * providing optimal coverage with minimal overlap.
     */
    T& spiral_next() {
        if (empty()) throw std::runtime_error("Empty buffer");

        size_type actual_index = (head_ + spiral_index_) % N;
        if (actual_index >= (head_ + size_) % N && actual_index < head_) {
            actual_index = head_ + (actual_index % size_);
        }

        // Advance spiral position by golden angle equivalent
        spiral_index_ = (spiral_index_ + golden_spiral_step()) % size_;

        return buffer_[actual_index];
    }

    /**
     * @brief Reset spiral traversal
     */
    void reset_spiral() { spiral_index_ = 0; }

    /**
     * @brief Get element at sunflower-distributed position
     *
     * @param index Logical index in sunflower distribution
     * @return Element at that spiral position
     */
    T& sunflower_at(size_type index) {
        if (index >= size_) throw std::out_of_range("Index out of range");

        // Calculate sunflower position using golden angle
        double angle = index * PhiConstants::GOLDEN_ANGLE;
        size_type actual_index = static_cast<size_type>(std::fmod(angle, size_));
        actual_index = (head_ + actual_index) % N;

        return buffer_[actual_index];
    }

    const T& sunflower_at(size_type index) const {
        return const_cast<SpiralBuffer*>(this)->sunflower_at(index);
    }

    /**
     * @brief Fill buffer using golden spiral pattern
     *
     * @param generator Function that generates values based on spiral position
     */
    template<typename Generator>
    void spiral_fill(Generator gen) {
        clear();

        for (size_type i = 0; i < N; ++i) {
            auto [x, y] = sunflower_point<double>(i, N);
            buffer_[i] = gen(x, y, i);
            size_++;
        }
        tail_ = 0;  // Wraps around

        obs::ContainerEvent<T> event(obs::EventType::SPIRAL_EXPAND);
        event.new_size = size_;
        this->notify(event);
    }

private:
    size_type golden_spiral_step() const {
        // Step size based on golden angle: ~137.5 degrees
        return static_cast<size_type>(size_ * PhiConstants::PHI_RECIPROCAL);
    }
};

// ===========================================================================
// UTILITY: GOLDEN CONTAINER ADAPTER
// ===========================================================================

/**
 * @brief Adapts any container to use golden ratio operations
 */
template<typename Container>
class GoldenAdapter {
    Container& container_;

public:
    explicit GoldenAdapter(Container& c) : container_(c) {}

    /**
     * @brief Get element at golden section point
     */
    auto& golden_element() {
        size_t index = static_cast<size_t>(container_.size() * PhiConstants::PHI_RECIPROCAL);
        return container_[index];
    }

    /**
     * @brief Binary search using golden section search
     */
    template<typename T, typename Compare = std::less<T>>
    auto golden_search(const T& value, Compare comp = Compare{}) {
        auto left = container_.begin();
        auto right = container_.end();

        while (left < right) {
            auto mid1 = left + static_cast<size_t>((right - left) * PhiConstants::PHI_RECIPROCAL);
            auto mid2 = left + static_cast<size_t>((right - left) * (1.0 - PhiConstants::PHI_RECIPROCAL));

            if (comp(*mid1, value)) {
                left = mid1 + 1;
            } else if (comp(value, *mid2)) {
                right = mid2;
            } else {
                left = mid1;
                right = mid2 + 1;
            }
        }

        return left;
    }

    /**
     * @brief Partition container at golden ratio point
     */
    auto partition_golden() {
        size_t split = static_cast<size_t>(container_.size() * PhiConstants::PHI_RECIPROCAL);
        return container_.begin() + split;
    }
};

/**
 * @brief Create a golden adapter for any container
 */
template<typename Container>
GoldenAdapter<Container> make_golden(Container& c) {
    return GoldenAdapter<Container>(c);
}

} // namespace containers
} // namespace golden

#endif // GOLDEN_CONTAINERS_HPP
