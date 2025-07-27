using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using Microsoft.JSInterop;
using PKHeX.Core;

// A class to represent the file input from JavaScript
public class FileInput
{
    public byte[] SaveData { get; set; } = Array.Empty<byte>();
    public string FileName { get; set; } = string.Empty;
}

public partial class SaveFileParser
{
    [JSInvokable]
    public static string ParseSaveFile(FileInput fileInput)
    {
        try
        {
            // Use the data from the input object
            var sav = SaveUtil.GetVariantSAV(fileInput.SaveData, fileInput.FileName);
            if (sav == null)
            {
                throw new ArgumentException("Invalid or unsupported save file. PKHeX.Core could not detect a valid save format.");
            }

            var result = new UnifiedSaveData
            {
                TrainerName = sav.OT,
                GameVersion = sav.Version.ToString(),
                Party = GetPartyData(sav)
            };

            return JsonSerializer.Serialize(result);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[C#] Exception: {ex}");
            return JsonSerializer.Serialize(new { error = $"An error occurred: {ex.Message}" });
        }
    }

    private static List<PokemonData> GetPartyData(SaveFile sav)
    {
        var party = new List<PokemonData>();
        foreach (var pkm in sav.PartyData)
        {
            if (pkm.Species == 0) continue;

            party.Add(new PokemonData
            {
                SpeciesId = pkm.Species,
                Nickname = pkm.Nickname,
                Level = pkm.CurrentLevel,
                Moves = pkm.Moves.Select(moveId => GameInfo.Strings.movelist[moveId]).ToList(),
                IVs = pkm.IVs,
                EVs = new int[] { pkm.EV_HP, pkm.EV_ATK, pkm.EV_DEF, pkm.EV_SPA, pkm.EV_SPD, pkm.EV_SPE },
                Nature = pkm.Nature.ToString()
            });
        }
        return party;
    }
}

public class UnifiedSaveData
{
    public string TrainerName { get; set; } = "";
    public string GameVersion { get; set; } = "";
    public List<PokemonData> Party { get; set; } = new();
}

public class PokemonData
{
    public int SpeciesId { get; set; }
    public string Nickname { get; set; } = "";
    public int Level { get; set; }
    public List<string> Moves { get; set; } = new();
    public int[] IVs { get; set; } = new int[6];
    public int[] EVs { get; set; } = new int[6];
    public string Nature { get; set; } = "";
}