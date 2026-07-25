import { useEffect } from 'react'
import { CHALLENGES } from '../features/challenges/challengeData'
import { getChallengeProgress } from '../features/challenges/challengeProgress'
import { useChallengeStore } from '../features/challenges/challengeStore'
import { playChallengeCompleteSound } from '../lib/audio/sounds'
import { useToastStore } from '../lib/toast/toastStore'
import { parseVoxelKey } from '../lib/voxel/key'
import { useProjectStore } from '../store/projectStore'
import type { VoxelKey } from '../types/project'

/**
 * Translucent preview cubes for whatever target cells the active
 * challenge still needs — a cube disappears the moment a real one is
 * placed there. No image/reference needed since the "picture" is just
 * more voxel data, rendered in the same space the kid is building in.
 *
 * Plain transparent fill only, no wireframe outline: a per-cube <Edges>
 * looked fine for one cube, but a target shape is dozens of adjacent
 * ghost cubes, and every shared internal face between neighbors got its
 * own outline too — the result was a dense, glowing lattice of lines
 * (worst in the middle of the shape, where the most cubes touch), not a
 * soft hint. The color is the target's real color, dimmed way down by
 * opacity alone — dropping it toward white as well (an earlier attempt)
 * threw away the "what color goes here" hint along with the harshness.
 */
export function ChallengeGhost() {
  const activeChallengeId = useChallengeStore((state) => state.activeChallengeId)
  const completedChallengeIds = useChallengeStore((state) => state.completedChallengeIds)
  const completeChallenge = useChallengeStore((state) => state.completeChallenge)
  const voxels = useProjectStore((state) => state.voxels)

  const challenge = CHALLENGES.find((item) => item.id === activeChallengeId) ?? null
  const { filled, total } = challenge
    ? getChallengeProgress(challenge, voxels)
    : { filled: 0, total: 0 }

  useEffect(() => {
    if (!challenge || total === 0) return
    if (filled === total && !completedChallengeIds.includes(challenge.id)) {
      completeChallenge(challenge.id)
      playChallengeCompleteSound()
      useToastStore.getState().show(`Готово! Ты собрал: ${challenge.title} 🎉`, 'success')
    }
  }, [challenge, filled, total, completedChallengeIds, completeChallenge])

  if (!challenge) return null

  return (
    <group>
      {Object.entries(challenge.target).map(([key, data]) => {
        if (voxels[key as VoxelKey]) return null
        const [x, y, z] = parseVoxelKey(key as VoxelKey)
        return (
          <mesh key={key} position={[x, y, z]} raycast={() => null}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
              color={data.color}
              transparent
              opacity={0.2}
              depthWrite={false}
            />
          </mesh>
        )
      })}
    </group>
  )
}
