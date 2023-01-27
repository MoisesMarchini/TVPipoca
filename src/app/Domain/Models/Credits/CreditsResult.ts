import { Actor } from "./Actor";
import { Production } from "./Production";

export interface CreditsResult {
  id: number,
  cast: Actor[],
  crew: Production[]
}
