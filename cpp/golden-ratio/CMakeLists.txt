cmake_minimum_required(VERSION 3.14)

project(GoldenRatioContainers
    VERSION 1.0.0
    DESCRIPTION "C++ containers implementing golden ratio (phi) based algorithms"
    LANGUAGES CXX
)

# C++17 required for structured bindings, optional, etc.
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Compiler warnings
if(CMAKE_CXX_COMPILER_ID MATCHES "GNU|Clang")
    add_compile_options(-Wall -Wextra -Wpedantic -Wno-unused-parameter)
elseif(MSVC)
    add_compile_options(/W4)
endif()

# Include directories
include_directories(${CMAKE_SOURCE_DIR}/include)

# Header-only library (interface library)
add_library(golden_ratio INTERFACE)
target_include_directories(golden_ratio INTERFACE
    $<BUILD_INTERFACE:${CMAKE_SOURCE_DIR}/include>
    $<INSTALL_INTERFACE:include>
)

# Main executable - Golden Ratio Containers
add_executable(golden_demo src/main.cpp)
target_link_libraries(golden_demo PRIVATE golden_ratio)

# Classifier demo - Content Classification & Routing
add_executable(classifier_demo src/classifier_demo.cpp)
target_link_libraries(classifier_demo PRIVATE golden_ratio)

# Optional: Enable threading for observer mutex
find_package(Threads)
if(Threads_FOUND)
    target_link_libraries(golden_demo PRIVATE Threads::Threads)
    target_link_libraries(classifier_demo PRIVATE Threads::Threads)
endif()

# Installation rules
install(DIRECTORY include/ DESTINATION include/golden)
install(TARGETS golden_ratio EXPORT GoldenRatioTargets)

# Testing (optional)
option(BUILD_TESTS "Build test executable" ON)
if(BUILD_TESTS)
    enable_testing()
    add_test(NAME GoldenRatioTests COMMAND golden_demo)
endif()

# Summary
message(STATUS "")
message(STATUS "Golden Ratio Containers Configuration:")
message(STATUS "  Version:      ${PROJECT_VERSION}")
message(STATUS "  C++ Standard: ${CMAKE_CXX_STANDARD}")
message(STATUS "  Build type:   ${CMAKE_BUILD_TYPE}")
message(STATUS "  Tests:        ${BUILD_TESTS}")
message(STATUS "")
