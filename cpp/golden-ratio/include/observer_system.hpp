/**
 * @file observer_system.hpp
 * @brief Observer Pattern System for Golden Ratio Containers
 *
 * Implements a robust observer pattern with:
 *   - Type-safe event dispatching
 *   - Priority-based observer ordering
 *   - Event filtering and propagation control
 *   - Thread-safe notification (optional mutex locking)
 */

#ifndef OBSERVER_SYSTEM_HPP
#define OBSERVER_SYSTEM_HPP

#include <functional>
#include <vector>
#include <algorithm>
#include <memory>
#include <string>
#include <unordered_map>
#include <optional>
#include <mutex>
#include <atomic>

namespace golden {
namespace obs {

// ===========================================================================
// EVENT TYPES
// ===========================================================================

/**
 * @brief Container modification event types
 */
enum class EventType {
    INSERT,          // Element inserted
    REMOVE,          // Element removed
    UPDATE,          // Element modified
    RESIZE,          // Container resized
    REBALANCE,       // Golden ratio rebalancing occurred
    PARTITION,       // Golden partition applied
    SPIRAL_EXPAND,   // Spiral container expansion
    CLEAR,           // Container cleared
    CAPACITY_CHANGE, // Capacity modified
    CUSTOM           // Custom user-defined event
};

/**
 * @brief Convert EventType to string representation
 */
inline std::string event_type_to_string(EventType type) {
    switch (type) {
        case EventType::INSERT:          return "INSERT";
        case EventType::REMOVE:          return "REMOVE";
        case EventType::UPDATE:          return "UPDATE";
        case EventType::RESIZE:          return "RESIZE";
        case EventType::REBALANCE:       return "REBALANCE";
        case EventType::PARTITION:       return "PARTITION";
        case EventType::SPIRAL_EXPAND:   return "SPIRAL_EXPAND";
        case EventType::CLEAR:           return "CLEAR";
        case EventType::CAPACITY_CHANGE: return "CAPACITY_CHANGE";
        case EventType::CUSTOM:          return "CUSTOM";
        default:                         return "UNKNOWN";
    }
}

// ===========================================================================
// EVENT DATA STRUCTURES
// ===========================================================================

/**
 * @brief Event propagation control
 */
struct PropagationControl {
    bool stopped = false;           // Stop further propagation
    bool prevented_default = false; // Prevent default action

    void stop_propagation() { stopped = true; }
    void prevent_default() { prevented_default = true; }
};

/**
 * @brief Base event structure
 */
template<typename T>
struct ContainerEvent {
    EventType type;
    std::string source_name;
    size_t timestamp;
    std::optional<T> old_value;
    std::optional<T> new_value;
    size_t index = 0;
    size_t old_size = 0;
    size_t new_size = 0;
    double phi_ratio = 0.0;        // Golden ratio involved in operation
    std::string custom_data;       // For custom events
    PropagationControl propagation;

    ContainerEvent(EventType t, const std::string& src = "")
        : type(t), source_name(src), timestamp(get_timestamp()) {}

    static size_t get_timestamp() {
        static std::atomic<size_t> counter{0};
        return counter++;
    }

    bool is_stopped() const { return propagation.stopped; }
};

// ===========================================================================
// OBSERVER INTERFACE
// ===========================================================================

/**
 * @brief Observer interface for container events
 *
 * @tparam T Element type of the observed container
 */
template<typename T>
class IObserver {
public:
    virtual ~IObserver() = default;

    /**
     * @brief Called when container state changes
     * @param event Event describing the change
     */
    virtual void on_notify(ContainerEvent<T>& event) = 0;

    /**
     * @brief Get observer priority (higher = called first)
     * @return Priority value (default: 0)
     */
    virtual int get_priority() const { return 0; }

    /**
     * @brief Check if observer should receive event type
     * @param type Event type to filter
     * @return true if observer wants this event type
     */
    virtual bool accepts_event(EventType type) const { return true; }

    /**
     * @brief Get observer name for debugging
     */
    virtual std::string get_name() const { return "Observer"; }
};

// ===========================================================================
// FUNCTION-BASED OBSERVER
// ===========================================================================

/**
 * @brief Lambda/function-based observer wrapper
 */
template<typename T>
class FunctionObserver : public IObserver<T> {
public:
    using Callback = std::function<void(ContainerEvent<T>&)>;
    using Filter = std::function<bool(EventType)>;

private:
    Callback callback_;
    Filter filter_;
    int priority_;
    std::string name_;

public:
    FunctionObserver(Callback cb, int priority = 0, std::string name = "FunctionObserver")
        : callback_(std::move(cb))
        , filter_([](EventType) { return true; })
        , priority_(priority)
        , name_(std::move(name)) {}

    FunctionObserver(Callback cb, Filter filter, int priority = 0, std::string name = "FunctionObserver")
        : callback_(std::move(cb))
        , filter_(std::move(filter))
        , priority_(priority)
        , name_(std::move(name)) {}

    void on_notify(ContainerEvent<T>& event) override {
        if (callback_) {
            callback_(event);
        }
    }

    int get_priority() const override { return priority_; }
    bool accepts_event(EventType type) const override { return filter_(type); }
    std::string get_name() const override { return name_; }
};

// ===========================================================================
// SUBJECT (OBSERVABLE) BASE CLASS
// ===========================================================================

/**
 * @brief Observable subject that containers inherit from
 *
 * @tparam T Element type stored in the container
 */
template<typename T>
class Observable {
public:
    using ObserverPtr = std::shared_ptr<IObserver<T>>;
    using WeakObserverPtr = std::weak_ptr<IObserver<T>>;

private:
    std::vector<ObserverPtr> observers_;
    mutable std::mutex mutex_;
    bool notifications_enabled_ = true;
    std::string subject_name_;

public:
    explicit Observable(std::string name = "Observable")
        : subject_name_(std::move(name)) {}

    virtual ~Observable() = default;

    /**
     * @brief Attach an observer
     *
     * Observers are automatically sorted by priority (descending).
     *
     * @param observer Observer to attach
     * @return Observer ID for later removal
     */
    size_t attach(ObserverPtr observer) {
        std::lock_guard<std::mutex> lock(mutex_);
        observers_.push_back(observer);
        sort_observers();
        return observers_.size() - 1;
    }

    /**
     * @brief Attach a function/lambda as observer
     */
    size_t attach(typename FunctionObserver<T>::Callback callback,
                  int priority = 0,
                  std::string name = "Lambda") {
        return attach(std::make_shared<FunctionObserver<T>>(
            std::move(callback), priority, std::move(name)));
    }

    /**
     * @brief Detach an observer
     * @param observer Observer to remove
     * @return true if observer was found and removed
     */
    bool detach(const ObserverPtr& observer) {
        std::lock_guard<std::mutex> lock(mutex_);
        auto it = std::find(observers_.begin(), observers_.end(), observer);
        if (it != observers_.end()) {
            observers_.erase(it);
            return true;
        }
        return false;
    }

    /**
     * @brief Detach observer by name
     */
    bool detach_by_name(const std::string& name) {
        std::lock_guard<std::mutex> lock(mutex_);
        auto it = std::remove_if(observers_.begin(), observers_.end(),
            [&name](const ObserverPtr& obs) {
                return obs->get_name() == name;
            });
        if (it != observers_.end()) {
            observers_.erase(it, observers_.end());
            return true;
        }
        return false;
    }

    /**
     * @brief Clear all observers
     */
    void detach_all() {
        std::lock_guard<std::mutex> lock(mutex_);
        observers_.clear();
    }

    /**
     * @brief Enable/disable notifications
     */
    void set_notifications_enabled(bool enabled) {
        std::lock_guard<std::mutex> lock(mutex_);
        notifications_enabled_ = enabled;
    }

    /**
     * @brief Check if notifications are enabled
     */
    bool notifications_enabled() const {
        std::lock_guard<std::mutex> lock(mutex_);
        return notifications_enabled_;
    }

    /**
     * @brief Get number of attached observers
     */
    size_t observer_count() const {
        std::lock_guard<std::mutex> lock(mutex_);
        return observers_.size();
    }

    /**
     * @brief Get subject name
     */
    const std::string& get_subject_name() const { return subject_name_; }

protected:
    /**
     * @brief Notify all observers of an event
     *
     * Observers are notified in priority order (highest first).
     * If an observer calls stop_propagation(), subsequent observers
     * are not notified.
     *
     * @param event Event to dispatch
     */
    void notify(ContainerEvent<T>& event) {
        std::vector<ObserverPtr> observers_copy;

        {
            std::lock_guard<std::mutex> lock(mutex_);
            if (!notifications_enabled_) return;
            observers_copy = observers_;
        }

        event.source_name = subject_name_;

        for (auto& observer : observers_copy) {
            if (event.is_stopped()) break;

            if (observer->accepts_event(event.type)) {
                observer->on_notify(event);
            }
        }
    }

    /**
     * @brief Create and dispatch a simple event
     */
    void emit(EventType type) {
        ContainerEvent<T> event(type);
        notify(event);
    }

    /**
     * @brief Create and dispatch an event with value change
     */
    void emit_value_change(EventType type, const T& old_val, const T& new_val, size_t index = 0) {
        ContainerEvent<T> event(type);
        event.old_value = old_val;
        event.new_value = new_val;
        event.index = index;
        notify(event);
    }

    /**
     * @brief Create and dispatch a resize event
     */
    void emit_resize(size_t old_size, size_t new_size, double phi_ratio = 0.0) {
        ContainerEvent<T> event(EventType::RESIZE);
        event.old_size = old_size;
        event.new_size = new_size;
        event.phi_ratio = phi_ratio;
        notify(event);
    }

private:
    void sort_observers() {
        std::stable_sort(observers_.begin(), observers_.end(),
            [](const ObserverPtr& a, const ObserverPtr& b) {
                return a->get_priority() > b->get_priority();
            });
    }
};

// ===========================================================================
// SPECIALIZED OBSERVERS
// ===========================================================================

/**
 * @brief Observer that logs all events
 */
template<typename T>
class LoggingObserver : public IObserver<T> {
    std::ostream& output_;
    std::string prefix_;

public:
    explicit LoggingObserver(std::ostream& output = std::cout, std::string prefix = "[LOG]")
        : output_(output), prefix_(std::move(prefix)) {}

    void on_notify(ContainerEvent<T>& event) override {
        output_ << prefix_ << " Event: " << event_type_to_string(event.type)
                << " from " << event.source_name
                << " (ts:" << event.timestamp << ")\n";
    }

    std::string get_name() const override { return "LoggingObserver"; }
    int get_priority() const override { return 100; } // High priority to log first
};

/**
 * @brief Observer that tracks statistics
 */
template<typename T>
class StatisticsObserver : public IObserver<T> {
    std::unordered_map<EventType, size_t> event_counts_;
    size_t total_events_ = 0;
    mutable std::mutex mutex_;

public:
    void on_notify(ContainerEvent<T>& event) override {
        std::lock_guard<std::mutex> lock(mutex_);
        event_counts_[event.type]++;
        total_events_++;
    }

    size_t get_count(EventType type) const {
        std::lock_guard<std::mutex> lock(mutex_);
        auto it = event_counts_.find(type);
        return (it != event_counts_.end()) ? it->second : 0;
    }

    size_t get_total() const {
        std::lock_guard<std::mutex> lock(mutex_);
        return total_events_;
    }

    void reset() {
        std::lock_guard<std::mutex> lock(mutex_);
        event_counts_.clear();
        total_events_ = 0;
    }

    std::string get_name() const override { return "StatisticsObserver"; }
};

/**
 * @brief Observer that triggers golden ratio rebalancing
 */
template<typename T>
class GoldenRebalanceObserver : public IObserver<T> {
    std::function<void()> rebalance_callback_;
    double ratio_threshold_;

public:
    explicit GoldenRebalanceObserver(std::function<void()> callback, double threshold = 0.05)
        : rebalance_callback_(std::move(callback)), ratio_threshold_(threshold) {}

    void on_notify(ContainerEvent<T>& event) override {
        if (event.type == EventType::INSERT || event.type == EventType::REMOVE) {
            // Check if ratio deviates too much from golden ratio
            if (event.phi_ratio > 0 &&
                std::abs(event.phi_ratio - 1.618) > ratio_threshold_) {
                if (rebalance_callback_) {
                    rebalance_callback_();
                }
            }
        }
    }

    bool accepts_event(EventType type) const override {
        return type == EventType::INSERT || type == EventType::REMOVE;
    }

    std::string get_name() const override { return "GoldenRebalanceObserver"; }
    int get_priority() const override { return -10; } // Low priority, after other observers
};

} // namespace obs
} // namespace golden

#endif // OBSERVER_SYSTEM_HPP
