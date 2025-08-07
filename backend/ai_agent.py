import random
import time
import json

# --- AGENT DEFINITIONS ---

class PerceptorAgent:
    """
    Gathers and simulates environmental and geospatial data.
    In a real-world scenario, this agent would connect to GIS databases,
    satellite imagery APIs, and sensor networks.
    """
    def run(self):
        print("[Perceptor Agent]: Gathering geospatial and environmental data...")
        time.sleep(1) # Simulate data gathering latency
        data = {
            "city_boundary": [[51.505, -0.09], [51.515, -0.12], [51.500, -0.11]],
            "population_density": round(random.uniform(3000, 8000), 2), # people per sq km
            "existing_green_space_sqkm": round(random.uniform(5, 15), 2),
            "commercial_zones": random.randint(5, 20),
            "residential_zones": random.randint(50, 150),
            "traffic_congestion_level": random.choice(["low", "medium", "high"])
        }
        print("[Perceptor Agent]: Data gathering complete.")
        return data

class PlanningAgent:
    """
    Generates a new urban plan based on the data provided by the PerceptorAgent.
    This agent would use optimization algorithms or generative models to create designs.
    """
    def run(self, perceived_data):
        print("[Planning Agent]: Generating a new urban development plan...")
        time.sleep(1.5) # Simulate planning computation
        
        plan = {
            "plan_id": f"plan_{int(time.time())}",
            "new_green_space_sqkm": round(perceived_data["existing_green_space_sqkm"] * random.uniform(0.1, 0.3), 2),
            "new_residential_zones": random.randint(5, 15),
            "new_commercial_zones": random.randint(1, 5),
            "public_transport_routes_added": random.randint(2, 5),
            "smart_building_proposals": [
                {"id": "B1", "type": "Mixed-Use", "location": [51.51, -0.10]},
                {"id": "B2", "type": "Residential", "location": [51.508, -0.115]},
            ]
        }
        print(f"[Planning Agent]: New plan '{plan['plan_id']}' generated.")
        return plan

class UtilityAgent:
    """
    Evaluates the generated plan against sustainability and efficiency metrics.
    It provides a quantitative score to guide the decision-making process.
    """
    def run(self, perceived_data, plan):
        print("[Utility Agent]: Evaluating plan for sustainability...")
        time.sleep(0.5) # Simulate evaluation
        
        # Simple scoring logic for demonstration
        score = 0
        
        # Reward green space
        total_green_space = perceived_data["existing_green_space_sqkm"] + plan["new_green_space_sqkm"]
        if total_green_space > 15:
            score += 40
        elif total_green_space > 10:
            score += 20

        # Reward public transport
        score += plan["public_transport_routes_added"] * 5

        # Penalize high traffic congestion if not addressed
        if perceived_data["traffic_congestion_level"] == "high" and plan["public_transport_routes_added"] < 3:
            score -= 15
        
        # Ensure score is within 0-100 range
        final_score = max(0, min(100, score + random.randint(10, 50)))
        
        print(f"[Utility Agent]: Plan evaluation complete. Sustainability Score: {final_score}/100")
        return final_score

class HumanInTheLoopAgent:
    """
    Simulates receiving and processing feedback from a human planner.
    In a real application, this would be an API endpoint that receives user input.
    """
    def run(self, plan, score):
        print("[Human-in-the-Loop Agent]: Awaiting human feedback...")
        time.sleep(0.5)
        
        # Simulate human decision based on the score
        if score > 65:
            feedback = "approved"
            reason = "Good balance of green space and infrastructure."
        elif score > 40:
            feedback = "needs_revision"
            reason = "Score is moderate. Suggest increasing public transport options."
        else:
            feedback = "disapproved"
            reason = "Low sustainability score. Re-evaluate green space allocation."
            
        print(f"[Human-in-the-Loop Agent]: Feedback received: {feedback.upper()}. Reason: {reason}")
        return {"feedback": feedback, "reason": reason}

# --- MAIN ORCHESTRATION LOOP ---

def run_urban_planner_simulation(iterations=3):
    """
    Main function to run the multi-agent simulation.
    """
    print("--- AI Urban Planner Simulation Initializing ---")
    
    # Instantiate agents
    perceptor = PerceptorAgent()
    planner = PlanningAgent()
    utility = UtilityAgent()
    human_interactor = HumanInTheLoopAgent()
    
    last_feedback = {"feedback": "initial", "reason": "Starting the first cycle."}

    for i in range(iterations):
        print(f"\n--- Iteration {i + 1} of {iterations} ---")
        print(f"Input from previous cycle: {last_feedback['reason']}")
        
        # 1. Perceive the environment
        current_data = perceptor.run()
        
        # 2. Generate a plan
        # In a real system, the planner would use the feedback to adjust its strategy.
        # For this simulation, we'll just pass it along in the print statements.
        new_plan = planner.run(current_data)
        
        # 3. Evaluate the plan
        sustainability_score = utility.run(current_data, new_plan)
        
        # 4. Get human feedback
        last_feedback = human_interactor.run(new_plan, sustainability_score)
        
        # Check for approval to stop the loop
        if last_feedback["feedback"] == "approved":
            print("\n--- Plan Approved! Simulation Concluding. ---")
            break
            
        time.sleep(2) # Wait before starting the next iteration

    print("\n--- AI Urban Planner Simulation Finished ---")


if __name__ == "__main__":
    run_urban_planner_simulation()
