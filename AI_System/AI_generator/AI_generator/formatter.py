def format_message(summary, warnings, benefits, recommendations):
    return {
        "summary": summary,
        "warnings": warnings[:3],
        "benefits": benefits[:3],
        "recommendations": recommendations[:3],
        "voice_script": summary + ". " + " ".join(recommendations[:2])
    }
