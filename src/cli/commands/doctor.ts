import { Command } from "commander";
import { doctor } from "../handlers/doctor/doctor";

export const doctorCommand = new Command("doctor")
  .description("GenOS Doctor - Check your GenOS workspace health")
  .action(doctor);